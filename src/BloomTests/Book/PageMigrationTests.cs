﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using NUnit.Framework;
using SIL.Xml;

namespace BloomTests.Book
{
	[TestFixture]
	public class PageMigrationTests : BookTestsBase
	{
		[Test]
		public void MigrateTextOnlyShellPage_CopiesText()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='d31c38d8-c1cb-4eb9-951b-d2840f6a8bdb' id='thePage'>
			   <div class='marginBox'>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>

						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='pis'>
							Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.
						</div>
						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='xyz'>
							Translation into xyz, the primary language.
						</div>
						<div class='bloom-editable' contenteditable='true' lang='z'></div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var newPage = (XmlElement) dom.SafeSelectNodes("//div[@id='thePage']")[0];

			CheckPageIsCustomizable(newPage);
			CheckPageLineage(page, newPage, "d31c38d8-c1cb-4eb9-951b-d2840f6a8bdb", "a31c38d8-c1cb-4eb9-951b-d2840f6a8bdb");
			CheckEditableText(newPage, "en", "There was an old man called Bilanga who was very tall and also not yet married.");
			CheckEditableText(newPage, "pis", "Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.");
			CheckEditableText(newPage, "xyz", "Translation into xyz, the primary language.");
			CheckEditableText(newPage, "z", "");
			Assert.That(newPage.SafeSelectNodes("//div[@lang='z' and contains(@class,'bloom-editable')]"), Has.Count.EqualTo(1), "Failed to remove old child element");
		}

		[Test]
		public void MigrateBasicPageWith2PartLineage_CopiesTextAndImage()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398382;426e78a9-34d3-47f1-8355-ae737470bb6e' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>

						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='pis'>
							Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.
						</div>
						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='xyz'>
							Translation into xyz, the primary language.
						</div>
						<div class='bloom-editable' contenteditable='true' lang='z'></div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var newPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];

			CheckPageIsCustomizable(newPage);
			CheckPageLineage(page, newPage, "5dcd48df-e9ab-4a07-afd4-6a24d0398382", "adcd48df-e9ab-4a07-afd4-6a24d0398382");
			CheckEditableText(newPage, "en", "There was an old man called Bilanga who was very tall and also not yet married.");
			CheckEditableText(newPage, "pis", "Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.");
			CheckEditableText(newPage, "xyz", "Translation into xyz, the primary language.");
			CheckEditableText(newPage, "z", "");
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img[@data-license='cc-by-nc-sa' and @data-copyright='Copyright © 2012, LASI' and @src='erjwx3bl.q3c.png']", 1);
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img", 1);
			Assert.That(newPage.SafeSelectNodes("//div[@lang='z' and contains(@class,'bloom-editable')]"), Has.Count.EqualTo(1), "Failed to remove old child element");
		}

		[Test]
		public void MigratePictureInMiddle_CopiesBothTextsAndImage()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398383' id='thePage'>
			   <div class='marginBox'>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-leadingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							English in first block
						</div>

						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='pis'>
							Tok Pisin in first block
						</div>
					</div>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>

						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='pis'>
							Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.
						</div>
						<div data-hasqtip='true' class='bloom-editable normal-style' contenteditable='true' lang='xyz'>
							Translation into xyz, the primary language.
						</div>
						<div class='bloom-editable' contenteditable='true' lang='z'></div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var newPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];

			CheckPageIsCustomizable(newPage);
			CheckPageLineage(page, newPage, "5dcd48df-e9ab-4a07-afd4-6a24d0398383", "adcd48df-e9ab-4a07-afd4-6a24d0398383");
			CheckEditableText(newPage, "en", "English in first block");
			CheckEditableText(newPage, "pis", "Tok Pisin in first block");
			CheckEditableText(newPage, "en", "There was an old man called Bilanga who was very tall and also not yet married.", 1);
			CheckEditableText(newPage, "pis", "Wanfala olman nem blong hem Bilanga barava tol an hem no marit tu.",1);
			CheckEditableText(newPage, "xyz", "Translation into xyz, the primary language.",1);
			CheckEditableText(newPage, "z", "",1);
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img[@data-license='cc-by-nc-sa' and @data-copyright='Copyright © 2012, LASI' and @src='erjwx3bl.q3c.png']", 1);
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img", 1);
			Assert.That(newPage.SafeSelectNodes("//div[@lang='z' and contains(@class,'bloom-editable')]"), Has.Count.EqualTo(1), "Failed to remove old child element");
		}

		[Test]
		public void MigrateJustPicture_CopiesImage()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398385' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var newPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];

			CheckPageIsCustomizable(newPage);
			CheckPageLineage(page, newPage, "5dcd48df-e9ab-4a07-afd4-6a24d0398385", "adcd48df-e9ab-4a07-afd4-6a24d0398385");
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img[@data-license='cc-by-nc-sa' and @data-copyright='Copyright © 2012, LASI' and @src='erjwx3bl.q3c.png']", 1);
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath("//img", 1);
		}


		[Test]
		public void MigrateUnknownPage_DoesNothing()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='5dcd48df-e9ab-4b07-afd4-6a24d0398382' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement) dom.SafeSelectNodes("//div[@id='thePage']")[0];
			var oldContent = page.OuterXml;
			book.BringPageUpToDate(page);

			var newPage = (XmlElement) dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.That(newPage.OuterXml, Is.EqualTo(oldContent), "should not have modified page");
			Assert.That(newPage, Is.EqualTo(page), "should not have copied, just kept");
		}

		[Test]
		public void MigratePageWithoutLineage_DoesNothing()
		{
			SetDom(@"<div class='bloom-page' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable normal-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			var oldContent = page.OuterXml;
			book.BringPageUpToDate(page);

			var newPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.That(newPage.OuterXml, Is.EqualTo(oldContent), "should not have modified page");
			Assert.That(newPage, Is.EqualTo(page), "should not have copied, just kept");
		}

		[Test]
		public void AddBigWordsStyleIfUsedAndNoUserStylesElement()
		{
			var dom = CreateAndMigrateBigWordsPage(headElt => { });
			AssertThatXmlIn.Dom(dom).HasAtLeastOneMatchForXpath("html/head/style[@type='text/css' and @title='userModifiedStyles' and text()='.BigWords-style { font-size: 45pt !important; text-align: center !important; }']");
		}

		[Test]
		public void DontChangeBigWordsStyleIfUsedAndPresent()
		{
			var dom = CreateAndMigrateBigWordsPage(headElt =>
			{
				var userStyles = headElt.OwnerDocument.CreateElement("style");
				userStyles.SetAttribute("type", "text/css");
				userStyles.SetAttribute("title", "userModifiedStyles");
				userStyles.InnerText = ".BigWords-style { font-size: 50pt !important; text-align: center !important; }";
				headElt.AppendChild(userStyles);
			});

			AssertThatXmlIn.Dom(dom).HasAtLeastOneMatchForXpath("html/head/style[@type='text/css' and @title='userModifiedStyles' and text()='.BigWords-style { font-size: 50pt !important; text-align: center !important; }']");
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("html/head/style[@type='text/css' and @title='userModifiedStyles' and text()='.BigWords-style { font-size: 45pt !important; text-align: center !important; }']");
		}

		[Test]
		public void AddBigWordsStyleIfNeededAndMissingFromStylesheet()
		{
			var dom = CreateAndMigrateBigWordsPage(headElt =>
			{
				var userStyles = headElt.OwnerDocument.CreateElement("style");
				userStyles.SetAttribute("type", "text/css");
				userStyles.SetAttribute("title", "userModifiedStyles");
				userStyles.InnerText = ".OtherWords-style { font-size: 50pt}";
				headElt.AppendChild(userStyles);

			});

			AssertThatXmlIn.Dom(dom).HasAtLeastOneMatchForXpath("html/head/style[@type='text/css' and @title='userModifiedStyles' and text()='.OtherWords-style { font-size: 50pt} .BigWords-style { font-size: 45pt !important; text-align: center !important; }']");
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("html/head/style[@type='text/css' and @title='userModifiedStyles' and text()='.BigWords-style { font-size: 45pt !important; text-align: center !important; }']");
		}

		//regression: BL-2782
		[Test]
		public void BringPageUpToDateWithMigration_WasA4Landscape_StaysA4Landscape()
		{
			SetDom(@"<div class='bloom-page A4Landscape' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398385' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var updatedPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.IsTrue(updatedPage.OuterXml.Contains("A4Landscape"), "the old page was in A4Landscape, so the migrated page should be, too.");
			Assert.IsFalse(updatedPage.OuterXml.Contains("A5Portrait"), "the old page was in A4Landscape, so the migrated page should not have some other size/orientation.");
		}

		[Test]
		public void BringPageUpToDateWithMigration_PageHasClassWeDidNotThinkAbout_ClassIsRetained()
		{
			SetDom(@"<div class='bloom-page A4Landscape foobar' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398385' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var updatedPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.IsTrue(updatedPage.OuterXml.Contains("foobar"),"foobar, a class in the old page, should be added to the newly constructed page");
		}

		[Test]
		public void BringPageUpToDateWithMigration_ClassInNewTemplatePage_ClassIsRetained()
		{
			SetDom(@"<div class='foobar' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398385' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var updatedPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.IsTrue(updatedPage.OuterXml.Contains("bloom-page"),"we expect that the new template page will have this class, which we've omitted from the old page");
		}

		[Test]
		public void BringPageUpToDateWithMigration_OldPageHadBasicBookClassName_ClassIsRemoved()
		{
			SetDom(@"<div class='foobar imageOnTop' data-pagelineage='5dcd48df-e9ab-4a07-afd4-6a24d0398385' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var updatedPage = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			Assert.IsFalse(updatedPage.OuterXml.Contains("imageOnTop"), "imageOnTop refers to the old fixed-stylesheet way of showing pages");
		}

		
		/// <summary>
		/// this is a regression test, from BL-2887
		/// </summary>
		[Test]
		public void BringPageUpToDateWithMigration_SourceHasNoDataPage_DoesNotAcquireDataPageFromTemplate()
		{
			//the  data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' here tells us we came from
			//an old template page and triggers migration to its current equivalent
			SetDom(@"<div class='imageOnTop'  data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);
			//The source template page has data-page='extra', but the migrated page *must not* have this.
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("//div[@id='thePage' and @data-page='extra']");
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("//div[@id='thePage' and @data-page]");
		}

		/// <summary>
		/// this is a regression test, from BL-2887
		/// </summary>
		[Test]
		public void BringPageUpToDateWithMigration_SourceHasEmptyDataPage_DoesNotAcquireDataPageFromTemplate()
		{
			//the  data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' here tells us we came from
			//an old template page and triggers migration to its current equivalent
			SetDom(@"<div class='imageOnTop'  data-page='' data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='erjwx3bl.q3c.png'></img></div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var page = (XmlElement)dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);
			//The source template page has data-page='extra', but the migrated page *must not* have this.
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("//div[@id='thePage' and @data-page='extra']");
			AssertThatXmlIn.Dom(dom).HasNoMatchForXpath("//div[@id='thePage' and @data-page]");
		}
		// Common code for tests of adding needed styles. The main difference between the tests is the state of the stylesheet
		// (if any) inserted by the modifyHead action.
		private XmlDocument CreateAndMigrateBigWordsPage(Action<XmlElement> modifyHead)
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable BigWords-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			modifyHead((XmlElement)dom.DocumentElement.ChildNodes[0]);
			var page = (XmlElement) dom.SafeSelectNodes("//div[@id='thePage']")[0];
			book.BringPageUpToDate(page);

			var newPage = (XmlElement) dom.SafeSelectNodes("//div[@id='thePage']")[0];

			CheckPageIsCustomizable(newPage);
			return dom;
		}

		[Test]
		public void UpdatePageToTemplate_UpdatesPage()
		{
			SetDom(@"<div class='bloom-page' data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' id='prevPage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable BigWords-style bloom-content1' contenteditable='true' lang='en'>
							Different text in first para.
						</div>
					</div>
				</div>
			</div>
<div class='bloom-page' data-pagelineage='FD115DFF-0415-4444-8E76-3D2A18DBBD27' id='thePage'>
			   <div class='marginBox'>
					<div class='bloom-imageContainer bloom-leadingElement'><img data-license='cc-by-nc-sa' data-copyright='Copyright © 2012, LASI' style='width: 608px; height: 471px; margin-left: 199px; margin-top: 0px;' src='erjwx3bl.q3c.png' alt='This picture, erjwx3bl.q3c.png, is missing or was loading too slowly.' height='471' width='608'></img></div>
					<div aria-describedby='qtip-1' data-hasqtip='true' class='bloom-translationGroup bloom-trailingElement normal-style'>
						<div aria-describedby='qtip-0' data-hasqtip='true' class='bloom-editable BigWords-style bloom-content1' contenteditable='true' lang='en'>
							There was an old man called Bilanga who was very tall and also not yet married.
						</div>
					</div>
				</div>
			</div>
			");
			var book = CreateBook();
			var dom = book.RawDom;
			var newPageDom = MakeDom((@"<div class='A5Portrait bloom-page numberedPage customPage bloom-combinedPage' data-page='extra' id='newTemplate'>
	  <div lang='en' class='pageLabel'>Picture in Middle</div>
	  <div lang='en' class='pageDescription'></div>
	  <div class='marginBox'>
		<div class='split-pane horizontal-percent'>
		  <div style='bottom: 76%' class='split-pane-component position-top'>
			<div class='split-pane-component-inner'>
			  <div class='bloom-translationGroup bloom-trailingElement normal-style'>
				<div lang='z' contenteditable='true' class='bloom-content1 bloom-editable'>
				</div>
			  </div>
			</div>
		  </div>
		  <div style='bottom: 76%' class='split-pane-divider horizontal-divider'></div>
		  <!--NB: this split percent has to be the same as that used for upper!!!!!!-->
		  <div style='height: 76%' class='split-pane-component position-bottom'>
			<div class='split-pane-component-inner'>
			  <div class='split-pane horizontal-percent'>
				<div style='bottom: 30%' class='split-pane-component position-top'>
				  <div class='split-pane-component-inner'>
					<div class='bloom-imageContainer bloom-leadingElement'><img src='placeHolder.png' alt='Could not load the picture'/>
					</div>
				  </div>
				</div>
				<div style='bottom: 30%' class='split-pane-divider horizontal-divider'></div>
				<!--NB: this split percent has to be the same as that used for upper!!!!!!-->
				<div style='height: 30%' class='split-pane-component position-bottom'>
				  <div class='split-pane-component-inner'>
					<div class='bloom-translationGroup bloom-trailingElement normal-style'>
					  <div lang='z' contenteditable='true' class='bloom-content1 bloom-editable'>
					  </div>
					</div>
				  </div>
				</div>
				<div class='split-pane-resize-shim'></div>
			  </div>
			</div>
		  </div>
		  <div class='split-pane-resize-shim'></div>
		</div>
	  </div>
	</div>"));
			var template = (XmlElement) newPageDom.SafeSelectNodes("//div[@id='newTemplate']")[0];

			book.UpdatePageToTemplate(book.OurHtmlDom, template, "thePage");

			var newPage = (XmlElement)dom.SafeSelectNodes(".//div[@id='thePage']")[0];
			Assert.That(newPage.Attributes["class"].Value, Is.EqualTo("A5Portrait bloom-page numberedPage customPage bloom-combinedPage bloom-monolingual"));
			Assert.That(newPage.Attributes["data-pagelineage"].Value, Is.EqualTo("newTemplate"));
			// We kept the image
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath(".//img[@data-license='cc-by-nc-sa' and @data-copyright='Copyright © 2012, LASI' and @src='erjwx3bl.q3c.png']", 1); // the one in the first page has slightly different attrs
			CheckEditableText(newPage, "en", "There was an old man called Bilanga who was very tall and also not yet married.");
			// We should have kept the second one in the new page even though we didn't put anything in it (and there is one in the first page, too).
			AssertThatXmlIn.Dom(dom).HasSpecifiedNumberOfMatchesForXpath(".//div[contains(@class, 'bloom-translationGroup')]", 3);
		}

		// Enhance: if there are ever cases where there are multiple image containers to migrate, test this.
		// Enhance: if there are ever cases where it is possible not to have exactly corresponding parent elements (e.g., migrating a page with
		// one translation group to one with two), test this.
		// The current intended behavior is to copy the corresponding ones, leave additional destination elements unchanged, and discard
		// additional source ones. Some way to warn the user in the latter case might be wanted. Or, we may want a way to specify which
		// source maps to which destination.

		// some attempt at verifying that it updated the page structure
		private void CheckPageIsCustomizable(XmlElement newPage)
		{
			Assert.That(newPage.Attributes["class"].Value, Is.StringContaining("customPage"));
		}

		private void CheckPageLineage(XmlElement oldPage, XmlElement newPage, string oldGuid, string newGuid)
		{
			var oldLineage = oldPage.Attributes["data-pagelineage"].Value;
			var newLineage = newPage.Attributes["data-pagelineage"].Value;
			Assert.That(newLineage, Is.EqualTo(oldLineage.Replace(oldGuid, newGuid)));
		}

		private void CheckEditableText(XmlElement page, string lang, string text, int groupIndex = 0)
		{
			var transGroup = (XmlElement)page.SafeSelectNodes(".//div[contains(@class,'bloom-translationGroup')]")[groupIndex];
			var editDiv = (XmlElement)transGroup.SafeSelectNodes("div[@lang='" + lang + "' and contains(@class,'bloom-editable')]")[0];
			var actualText = editDiv.InnerXml;
			Assert.That(actualText.Trim(), Is.EqualTo(text));
		}
	}
}
