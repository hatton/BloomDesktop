﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;
using Bloom.Book;
using Bloom.Properties;
using SIL.Xml;

namespace Bloom
{
	/// <summary>
	/// This class is a place to gather the methods that have to do with making thumbnails of pages of books.
	/// Three of the methods were previously methods of Book itself, but the fourth (MakeThumbnailOfCover)
	/// needed to do too much UI stuff to belong in a model class, so it seemed worth pulling all this
	/// out to a new class.
	/// In live code there is typically only one instance of this created by the ApplicationServer.
	/// In test code they may be created as needed; nothing requires this to be a singleton.
	/// Indeed, it could be a static class except that it requires the HtmlThumbNailer.
	/// </summary>
	public class BookThumbNailer
	{
		private readonly HtmlThumbNailer _thumbnailProvider;

		public BookThumbNailer(HtmlThumbNailer thumbNailer)
		{
			_thumbnailProvider = thumbNailer;
		}

		public HtmlThumbNailer HtmlThumbNailer { get { return _thumbnailProvider;} }

		public void GetThumbNailOfBookCoverAsync(Book.Book book, HtmlThumbNailer.ThumbnailOptions thumbnailOptions, Action<Image> callback, Action<Exception> errorCallback)
		{
			if (book is ErrorBook)
			{
				callback(Resources.Error70x70);
				return;
			}
			try
			{
				if (book.HasFatalError) //NB: we might not know yet... we don't fully load every book just to show its thumbnail
				{
					callback(Resources.Error70x70);
				}
				Image thumb;
				if (book.Storage.TryGetPremadeThumbnail(thumbnailOptions.FileName, out thumb))
				{
					callback(thumb);
					return;
				}

				var dom = book.GetPreviewXmlDocumentForFirstPage();
				if (dom == null)
				{
					callback(Resources.Error70x70);
					return;
				}
				string folderForCachingThumbnail;

				folderForCachingThumbnail = book.Storage.FolderPath;
				_thumbnailProvider.GetThumbnailAsync(folderForCachingThumbnail, book.Storage.Key, dom, thumbnailOptions, callback, errorCallback);
			}
			catch (Exception err)
			{
				callback(Resources.Error70x70);
				Debug.Fail(err.Message);
			}
		}

		public void MakeThumbnailOfCover(Book.Book book, int height, Control invokeTarget)
		{
			bool done = false;
			string error = null;

			HtmlThumbNailer.ThumbnailOptions options = new HtmlThumbNailer.ThumbnailOptions()
			{
				CenterImageUsingTransparentPadding = false,
				//since this is destined for HTML, it's much easier to handle if there is no pre-padding

				Height = height,
				Width = -1,
				FileName = "thumbnail-" + height + ".png"
			};

			RebuildThumbNailAsync(book, options, (info, image) => done = true,
				(info, ex) =>
				{
					done = true;
					throw ex;
				});
			var giveUpTime = DateTime.Now.AddSeconds(15);
			while (!done && DateTime.Now < giveUpTime)
			{
				Thread.Sleep(100);
				Application.DoEvents();
				// In the context of bulk upload, when a model dialog is the only window, apparently Application.Idle is never invoked.
				// So we need a trick to allow the thumbnailer to actually make some progress, since it usually works while idle.
				_thumbnailProvider.Advance(invokeTarget);
			}
			if (!done)
			{
				throw new ApplicationException(String.Format("Gave up waiting for the {0} to be created. This usually means Bloom is busy making thumbnails for other things. Wait a bit, and try again.", options.FileName));
			}
		}

		///   <summary>
		///   Currently used by the image server
		///   to get thumbnails that are used in the add page dialog. Since this dialog can show
		///   an enlarged version of the page, we generate these at a higher resolution than usual.
		///   Also, to make more realistic views of template pages we insert fake text wherever
		///   there is an empty edit block.
		///
		///   The result is cached for possible future use so the caller should not dispose of it.
		///   </summary>
		/// <param name="book"></param>
		/// <param name="page"></param>
		///  <param name="isLandscape"></param>
		///  <returns></returns>
		public Image GetThumbnailForPage(Book.Book book, IPage page, bool isLandscape)
		{
			var pageDom = book.GetThumbnailXmlDocumentForPage(page);
			var thumbnailOptions = new HtmlThumbNailer.ThumbnailOptions()
			{
				BackgroundColor = Color.White,// matches the hand-made previews.
				BorderStyle = HtmlThumbNailer.ThumbnailOptions.BorderStyles.None, // allows the HTML to add its preferred border in the larger preview
				CenterImageUsingTransparentPadding = true
			};
			var pageDiv = pageDom.RawDom.SafeSelectNodes("descendant-or-self::div[contains(@class,'bloom-page')]").Cast<XmlElement>().FirstOrDefault();
			// The actual page size is rather arbitrary, but we want the right ratio for A4.
			// Using the actual A4 sizes in mm makes a big enough image to look good in the larger
			// preview box on the right as well as giving exactly the ratio we want.
			// We need to make the image the right shape to avoid some sort of shadow/box effects
			// that I can't otherwise find a way to get rid of.
			if (isLandscape)
			{
				thumbnailOptions.Width = 297;
				thumbnailOptions.Height = 210;
				pageDiv.SetAttribute("class", pageDiv.Attributes["class"].Value.Replace("Portrait", "Landscape"));
			}
			else
			{
				thumbnailOptions.Width = 210;
				thumbnailOptions.Height = 297;
				// On the offchance someone makes a template with by-default-landscape pages...
				pageDiv.SetAttribute("class", pageDiv.Attributes["class"].Value.Replace("Landscape", "Portrait"));
			}
			// In different books (or even the same one) in the same session we may have portrait and landscape
			// versions of the same template page. So we must use different IDs.
			return _thumbnailProvider.GetThumbnail(page.Id + (isLandscape ? "L" : ""), pageDom, thumbnailOptions);
		}

		/// <summary>
		/// Will call either 'callback' or 'errorCallback' UNLESS the thumbnail is readonly, in which case it will do neither.
		/// </summary>
		/// <param name="book"></param>
		/// <param name="thumbnailOptions"></param>
		/// <param name="callback"></param>
		/// <param name="errorCallback"></param>
		public void RebuildThumbNailAsync(Book.Book book, HtmlThumbNailer.ThumbnailOptions thumbnailOptions,  Action<BookInfo, Image> callback, Action<BookInfo, Exception> errorCallback)
		{
			if (!book.Storage.RemoveBookThumbnail(thumbnailOptions.FileName))
			{
				// thumbnail is marked readonly, so just use it
				Image thumb;
				book.Storage.TryGetPremadeThumbnail(thumbnailOptions.FileName, out thumb);
				callback(book.BookInfo, thumb);
				return;
			}

			_thumbnailProvider.RemoveFromCache(book.Storage.Key);

			thumbnailOptions.BorderStyle = (book.Type == Book.Book.BookType.Publication)?HtmlThumbNailer.ThumbnailOptions.BorderStyles.Solid : HtmlThumbNailer.ThumbnailOptions.BorderStyles.Dashed;
			GetThumbNailOfBookCoverAsync(book, thumbnailOptions, image=>callback(book.BookInfo,image),
				error=>
				{
					//Enhance; this isn't a very satisfying time to find out, because it's only going to happen if we happen to be rebuilding the thumbnail.
					//It does help in the case where things are bad, so no thumbnail was created, but by then probably the user has already had some big error.
					//On the other hand, given that they have this bad book in their collection now, it's good to just remind them that it's broken and not
					//keep showing green error boxes.
					book.CheckForErrors();
					errorCallback(book.BookInfo, error);
				});
		}
	}
}
