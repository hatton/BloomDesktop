using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Bloom.Book;
using Bloom.Collection;
using ICSharpCode.SharpZipLib.Zip;
using Moq;
using NUnit.Framework;
using SIL.IO;
using SIL.TestUtilities;
using SIL.Windows.Forms.ClearShare;

namespace BloomTests.Book
{
	class BookCompressorTests : BookTestsBase
	{
		private BookServer _bookServer;
		private TemporaryFolder _projectFolder;
		private Mock<CollectionSettings> _librarySettings;
		private BookStarter _starter;

		private string kMinimumValidBookHtml =
			@"<html><head><link rel='stylesheet' href='Basic Book.css' type='text/css'></link></head><body>
					<div class='bloom-page' id='guid1'></div>
			</body></html>";

		[SetUp]
		public void SetupFixture()
		{
			_bookServer = CreateBookServer();
		}

		[Test]
		public void CompressBookForDevice_FileNameIsCorrect()
		{
			var testBook = CreateBookWithPhysicalFile(kMinimumValidBookHtml, bringBookUpToDate: true);

			using (var bloomdTempFile = TempFile.WithFilenameInTempFolder(testBook.Title + BookCompressor.ExtensionForDeviceBloomBook))
			{
				BookCompressor.CompressBookForDevice(bloomdTempFile.Path, testBook, _bookServer);
				Assert.AreEqual(testBook.Title + BookCompressor.ExtensionForDeviceBloomBook,
					Path.GetFileName(bloomdTempFile.Path));
			}
		}

		[Test]
		public void CompressBookForDevice_IncludesWantedFiles()
		{
			var wantedFiles = new List<string>()
			{
				"thumbnail.png", // should be left alone
				"previewMode.css",
				"meta.json", // should be left alone
				"readerStyles.css", // gets added
				"Device-XMatter.css" // added when we apply this xmatter
			};

			TestHtmlAfterCompression(kMinimumValidBookHtml,
				actionsOnFolderBeforeCompressing: folderPath =>
				{
					// These png files have to be real; just putting some text in it leads to out-of-memory failures when Bloom
					// tries to make its background transparent.
					File.Copy(SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "shirt.png"),
						Path.Combine(folderPath, "thumbnail.png"));
					File.WriteAllText(Path.Combine(folderPath, "previewMode.css"), @"This is wanted");
				},
				assertionsOnZipArchive: zip =>
				{
					foreach (var name in wantedFiles)
					{
						Assert.AreNotEqual(-1, zip.FindEntry(Path.GetFileName(name), true), "expected " + name + " to be part of .bloomd zip");
					}
				});
		}

		[Test]
		public void CompressBookForDevice_OmitsUnwantedFiles()
		{
			// some files we don't want copied into the .bloomd
			var unwantedFiles = new List<string> {
				"book.BloomBookOrder", "book.pdf", "thumbnail-256.png", "thumbnail-70.png", // these are artifacts of uploading book to BloomLibrary.org
				"Traditional-XMatter.css" // since we're adding Device-XMatter.css, this is no longer needed
			};

			TestHtmlAfterCompression(kMinimumValidBookHtml,
				actionsOnFolderBeforeCompressing: folderPath =>
				{
					// The png files have to be real; just putting some text in them leads to out-of-memory failures when Bloom
					// tries to make their background transparent.
					File.Copy(SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "shirt.png"), Path.Combine(folderPath, "thumbnail.png"));
					File.WriteAllText(Path.Combine(folderPath, "previewMode.css"), @"This is wanted");

					// now some files we expect to be omitted from the .bloomd archive
					File.WriteAllText(Path.Combine(folderPath, "book.BloomBookOrder"), @"This is unwanted");
					File.WriteAllText(Path.Combine(folderPath, "book.pdf"), @"This is unwanted");
					File.Copy(SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "shirt.png"), Path.Combine(folderPath, "thumbnail-256.png"));
					File.Copy(SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "shirt.png"), Path.Combine(folderPath, "thumbnail-70.png"));
				},
				assertionsOnZipArchive: zip =>
				{
					foreach(var name in unwantedFiles)
					{
						Assert.AreEqual(-1, zip.FindEntry(Path.GetFileName(name), true),
							"expected " + name + " to not be part of .bloomd zip");
					}
				});
		}

		// Also verifies that images that DO exist are NOT removed (even if src attr includes params like ?optional=true)
		// Since this is one of the few tests that makes a real HTML file we use it also to check
		// the the HTML file is at the root of the zip.
		[Test]
		public void CompressBookForDevice_RemovesImgElementsWithMissingSrc_AndContentEditable()
		{
			const string imgsToRemove = "<img class='branding branding-wide' src='back-cover-outside-wide.svg' type='image/svg' onerror='this.style.display='none''></img><img src = 'nonsence.svg'/><img src=\"rubbish\"> </img  >";
			const string positiveCe = " contenteditable=\"true\""; // This one uses double quotes just to confirm that works.
			const string negativeCe = " contenteditable='false'";
			var htmlTemplate = @"<html>
									<body>
										<div class='bloom-page cover coverColor outsideBackCover bloom-backMatter A5Portrait' data-page='required singleton' data-export='back-matter-back-cover' id='b1b3129a-7675-44c4-bc1e-8265bd1dfb08'>
											<div class='pageLabel' lang='en'>
												Outside Back Cover
											</div>
											<div class='pageDescription' lang='en'></div>

											<div class='marginBox'>
											<div class='bloom-translationGroup' data-default-languages='N1'>
												<div class='bloom-editable Outside-Back-Cover-style bloom-copyFromOtherLanguageIfNecessary bloom-contentNational1 bloom-visibility-code-on' lang='fr'{1} data-book='outsideBackCover'>
													<label class='bubble'>If you need somewhere to put more information about the book, you can use this page, which is the outside of the back cover.</label>
												</div>

												<div class='bloom-editable Outside-Back-Cover-style bloom-copyFromOtherLanguageIfNecessary bloom-contentNational2' lang='de'{1} data-book='outsideBackCover'></div>

												<div class='bloom-editable Outside-Back-Cover-style bloom-copyFromOtherLanguageIfNecessary bloom-content1' lang='ksf'{1} data-book='outsideBackCover'></div>
											</div{2}>{0} <img class='branding' src='back-cover-outside.svg?optional=true' type='image/svg' onerror='this.style.display='none''></img></div>
										</div>
									</body>
									</html>";
			var htmlOriginal = string.Format(htmlTemplate, imgsToRemove, positiveCe, negativeCe);
			var testBook = CreateBookWithPhysicalFile(htmlOriginal, bringBookUpToDate: true);

			TestHtmlAfterCompression(htmlOriginal,
				actionsOnFolderBeforeCompressing:
				bookFolderPath => // Simulate the typical situation where we have the regular but not the wide svg
						File.WriteAllText(Path.Combine(bookFolderPath, "back-cover-outside.svg"), @"this is a fake for testing"),

				assertionsOnResultingHtmlString:
				html =>
				{
					AssertThatXmlIn.String(html).HasSpecifiedNumberOfMatchesForXpath("//img", 2); // only license and back-cover-outside.svg survives
					AssertThatXmlIn.String(html).HasSpecifiedNumberOfMatchesForXpath("//img[@src='back-cover-outside.svg?optional=true']", 1); // only back-cover-outside.svg survives
					AssertThatXmlIn.String(html).HasNoMatchForXpath("//div[@contenteditable]");
				});
		}

		[Test]
		public void CompressBookForDevice_ImgInImageContainer_ConvertedToBackground()
		{
			// The odd file names here are an important part of the test; they need to get converted to proper URL syntax.
			const string bookHtml = @"<html>
										<body>
											<div class='bloom-page' id='blah'>
												<div class='marginBox'>
													<div class='bloom-imageContainer bloom-leadingElement'>"
													+"	<img src=\"HL00'14 1.svg\"/>"
													+@"</div>
													<div class='bloom-imageContainer bloom-leadingElement'>"
														+ "<img src=\"HL00'14 1.svg\"/>"
													+@"</div>
											</div>
										</body>
									</html>";

			TestHtmlAfterCompression(bookHtml,
				actionsOnFolderBeforeCompressing:
					bookFolderPath => File.WriteAllText(Path.Combine(bookFolderPath, "HL00'14 1.svg"), @"this is a fake for testing"),
				assertionsOnResultingHtmlString:
					changedHtml =>
					{
						// The imgs should be replaced with something like this:
						//		"<div class='bloom-imageContainer bloom-leadingElement bloom-backgroundImage' style='background-image:url('HL00%2714%201.svg.svg')'</div>
						//	Note that normally there would also be data-creator, data-license, etc. If we put those in the html, they will be stripped because
						// the code will actually look at our fake image and, finding now metadata will remove these. This is not a problem for our
						// testing here, because we're not trying to test the functioning of that function here. The bit we can test, that the image became a
						// background image, is sufficient to know the function was run.

						// Oct 2017 jh: I added this bloom-imageContainer/ because the code that does the conversion is limited to these,
						// presumably because that is the only img's that were giving us problems (ones that need to be sized at display time).
						// But Xmatter has other img's, for license & branding.
						AssertThatXmlIn.String(changedHtml).HasNoMatchForXpath("//bloom-imageContainer/img"); // should be merged into parent

						//Note: things like  @data-creator='Anis', @data-license='cc-by' and @data-copyright='1996 SIL PNG' are not going to be there by now,
						//because they aren't actually supported by the image file, so they get stripped.
						AssertThatXmlIn.String(changedHtml).HasSpecifiedNumberOfMatchesForXpath("//div[@class='bloom-imageContainer bloom-leadingElement bloom-backgroundImage' and @style=\"background-image:url('HL00%2714%201.svg')\"]", 2);
					});
		}

		[Test]
		public void CompressBookForDevice_IncludesVersionFileAndStyleSheet()
		{
			// This requires a real book file (which a mocked book usually doesn't have).
			// It's also important that the book contains something like contenteditable that will be removed when
			// sending the book. The sha is based on the actual file contents of the book, not the
			// content actually embedded in the bloomd.
			var bookHtml = @"<html>
								<head>
									<meta charset='UTF-8'></meta>
									<link rel='stylesheet' href='../settingsCollectionStyles.css' type='text/css'></link>
									<link rel='stylesheet' href='../customCollectionStyles.css' type='text/css'></link>
								</head>
								<body>
									<div class='bloom-page cover coverColor outsideBackCover bloom-backMatter A5Portrait' data-page='required singleton' data-export='back-matter-back-cover' id='b1b3129a-7675-44c4-bc1e-8265bd1dfb08'>
										<div  contenteditable='true'>something</div>
									</div>
								</body>
							</html>";

			TestHtmlAfterCompression(bookHtml,
				actionsOnFolderBeforeCompressing:
				bookFolderPath => // Simulate the typical situation where we have the regular but not the wide svg
					File.WriteAllText(Path.Combine(bookFolderPath, "back-cover-outside.svg"), @"this is a fake for testing"),

				assertionsOnResultingHtmlString:
				html =>
				{
					AssertThatXmlIn.String(html).HasSpecifiedNumberOfMatchesForXpath("//html/head/link[@rel='stylesheet' and @href='readerStyles.css' and @type='text/css']", 1);
				},

				assertionsOnZipArchive: zip =>
					// This test worked when we didn't have to modify the book before making the .bloomd.
					// Now that we do I haven't figured out a reasonable way to rewrite it to test this value again...
					// Assert.That(GetEntryContents(zip, "version.txt"), Is.EqualTo(Bloom.Book.Book.MakeVersionCode(html, bookPath)));
					// ... so for now we just make sure that it was added and looks like a hash code
						Assert.AreEqual(44, GetEntryContents(zip, "version.txt").Length)
				);
		}

		private string GetEntryContents(ZipFile zip, string name, bool exact = false)
		{
			var buffer = new byte[4096];

			Func<ZipEntry, bool> predicate;
			if (exact)
				predicate = n => n.Name.Equals(name);
			else
				predicate = n => n.Name.EndsWith(name);

			var ze = (from ZipEntry entry in zip select entry).FirstOrDefault(predicate);
			Assert.That(ze, Is.Not.Null);

			using (var instream = zip.GetInputStream(ze))
			using (var writer = new MemoryStream())
			{
				ICSharpCode.SharpZipLib.Core.StreamUtils.Copy(instream, writer, buffer);
				writer.Position = 0;
				using (var reader = new StreamReader(writer))
				{
					return reader.ReadToEnd();
				}
			}
		}

		// re-use the images from another test (added LakePendOreille.jpg for these tests)
		private const string _pathToTestImages = "src/BloomTests/ImageProcessing/images";

		[Test]
		public void GetBytesOfReducedImage_SmallPngImageMadeTransparent()
		{
			// bird.png:                   PNG image data, 274 x 300, 8-bit/color RGBA, non-interlaced

			var path = SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "bird.png");
			byte[] originalBytes = File.ReadAllBytes(path);
			byte[] reducedBytes = BookCompressor.GetBytesOfReducedImage(path);
			Assert.That(reducedBytes, Is.Not.EqualTo(originalBytes)); // no easy way to check it was made transparent, but should be changed.
			// Size should not change much.
			Assert.That(reducedBytes.Length, Is.LessThan(originalBytes.Length * 11/10));
			Assert.That(reducedBytes.Length, Is.GreaterThan(originalBytes.Length * 9 / 10));
			using (var tempFile = TempFile.WithExtension(Path.GetExtension(path)))
			{
				var oldMetadata = Metadata.FromFile(path);
				RobustFile.WriteAllBytes(tempFile.Path, reducedBytes);
				var newMetadata = Metadata.FromFile(tempFile.Path);
				if (oldMetadata.IsEmpty)
				{
					Assert.IsTrue(newMetadata.IsEmpty);
				}
				else
				{
					Assert.IsFalse(newMetadata.IsEmpty);
					Assert.AreEqual(oldMetadata.CopyrightNotice, newMetadata.CopyrightNotice, "copyright preserved for bird.png");
					Assert.AreEqual(oldMetadata.Creator, newMetadata.Creator, "creator preserved for bird.png");
					Assert.AreEqual(oldMetadata.License.ToString(), newMetadata.License.ToString(), "license preserved for bird.png");
				}
			}
		}

		[Test]
		public void GetBytesOfReducedImage_SmallJpgImageStaysSame()
		{
			// man.jpg:                    JPEG image data, JFIF standard 1.01, ..., precision 8, 118x154, frames 3

			var path = SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "man.jpg");
			var originalBytes = File.ReadAllBytes(path);
			var reducedBytes = BookCompressor.GetBytesOfReducedImage(path);
			Assert.AreEqual(originalBytes, reducedBytes, "man.jpg is already small enough (118x154)");
			using (var tempFile = TempFile.WithExtension(Path.GetExtension(path)))
			{
				var oldMetadata = Metadata.FromFile(path);
				RobustFile.WriteAllBytes(tempFile.Path, reducedBytes);
				var newMetadata = Metadata.FromFile(tempFile.Path);
				if (oldMetadata.IsEmpty)
				{
					Assert.IsTrue(newMetadata.IsEmpty);
				}
				else
				{
					Assert.IsFalse(newMetadata.IsEmpty);
					Assert.AreEqual(oldMetadata.CopyrightNotice, newMetadata.CopyrightNotice, "copyright preserved for man.jpg");
					Assert.AreEqual(oldMetadata.Creator, newMetadata.Creator, "creator preserved for man.jpg");
					Assert.AreEqual(oldMetadata.License.ToString(), newMetadata.License.ToString(), "license preserved for man.jpg");
				}
			}
		}

		[Test]
		public void GetBytesOfReducedImage_LargePngImageReduced()
		{
			// shirtWithTransparentBg.png: PNG image data, 2208 x 2400, 8-bit/color RGBA, non-interlaced

			var path = SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "shirt.png");
			var originalBytes = File.ReadAllBytes(path);
			var reducedBytes = BookCompressor.GetBytesOfReducedImage(path);
			Assert.Greater(originalBytes.Length, reducedBytes.Length, "shirt.png is reduced from 2208x2400");
			using (var tempFile = TempFile.WithExtension(Path.GetExtension(path)))
			{
				var oldMetadata = Metadata.FromFile(path);
				RobustFile.WriteAllBytes(tempFile.Path, reducedBytes);
				var newMetadata = Metadata.FromFile(tempFile.Path);
				if (oldMetadata.IsEmpty)
				{
					Assert.IsTrue(newMetadata.IsEmpty);
				}
				else
				{
					Assert.IsFalse(newMetadata.IsEmpty);
					Assert.AreEqual(oldMetadata.CopyrightNotice, newMetadata.CopyrightNotice, "copyright preserved for shirt.png");
					Assert.AreEqual(oldMetadata.Creator, newMetadata.Creator, "creator preserved for shirt.png");
					Assert.AreEqual(oldMetadata.License.ToString(), newMetadata.License.ToString(), "license preserved for shirt.png");
				}
			}
		}

		[Test]
		public void GetBytesOfReducedImage_LargeJpgImageReduced()
		{
			// LakePendOreille.jpg:        JPEG image data, JFIF standard 1.01, ... precision 8, 3264x2448, frames 3

			var path = SIL.IO.FileLocator.GetFileDistributedWithApplication(_pathToTestImages, "LakePendOreille.jpg");
			var originalBytes = File.ReadAllBytes(path);
			var reducedBytes = BookCompressor.GetBytesOfReducedImage(path);
			Assert.Greater(originalBytes.Length, reducedBytes.Length, "LakePendOreille.jpg is reduced from 3264x2448");
			using (var tempFile = TempFile.WithExtension(Path.GetExtension(path)))
			{
				var oldMetadata = Metadata.FromFile(path);
				RobustFile.WriteAllBytes(tempFile.Path, reducedBytes);
				var newMetadata = Metadata.FromFile(tempFile.Path);
				if (oldMetadata.IsEmpty)
				{
					Assert.IsTrue(newMetadata.IsEmpty);
				}
				else
				{
					Assert.IsFalse(newMetadata.IsEmpty);
					Assert.AreEqual(oldMetadata.CopyrightNotice, newMetadata.CopyrightNotice, "copyright preserved for LakePendOreille.jpg");
					Assert.AreEqual(oldMetadata.Creator, newMetadata.Creator, "creator preserved for LakePendOreille.jpg");
					Assert.AreEqual(oldMetadata.License.ToString(), newMetadata.License.ToString(), "license preserved for LakePendOreille.jpg");
				}
			}
		}

		[Test]
		public void CompressBookForDevice_PointsAtDeviceXMatter()
		{
			var bookHtml = @"<html><head>
						<link rel='stylesheet' href='Basic Book.css' type='text/css'></link>
						<link rel='stylesheet' href='Traditional-XMatter.css' type='text/css'></link>
					</head><body>
					<div class='bloom-page' id='guid1'></div>
			</body></html>";
			TestHtmlAfterCompression(bookHtml,
				assertionsOnResultingHtmlString: html =>
				{
					AssertThatXmlIn.String(html)
						.HasSpecifiedNumberOfMatchesForXpath(
							"//html/head/link[@rel='stylesheet' and @href='Device-XMatter.css' and @type='text/css']", 1);
					AssertThatXmlIn.String(html)
						.HasNoMatchForXpath(
							"//html/head/link[@rel='stylesheet' and @href='Traditional-XMatter.css' and @type='text/css']");

				});
		}

		private void TestHtmlAfterCompression(string originalBookHtml, Action<string> actionsOnFolderBeforeCompressing = null,
			Action<string> assertionsOnResultingHtmlString = null,
			Action<ZipFile> assertionsOnZipArchive = null)
		{
			var testBook = CreateBookWithPhysicalFile(originalBookHtml, bringBookUpToDate: true);
			var bookFileName = Path.GetFileName(testBook.GetPathHtmlFile());

			actionsOnFolderBeforeCompressing?.Invoke(testBook.FolderPath);

			using (var bloomdTempFile = TempFile.WithFilenameInTempFolder(testBook.Title + BookCompressor.ExtensionForDeviceBloomBook))
			{
				BookCompressor.CompressBookForDevice(bloomdTempFile.Path, testBook, _bookServer);
				var zip = new ZipFile(bloomdTempFile.Path);
				assertionsOnZipArchive?.Invoke(zip);
				var newHtml = GetEntryContents(zip, bookFileName);
				assertionsOnResultingHtmlString?.Invoke(newHtml);
			}
		}
	}
}
