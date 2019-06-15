using Bloom.Api;
using Bloom.MiscUI;

namespace Bloom.web.controllers
{
	class BrowserDialogApi
	{
		public void RegisterWithApiHandler(BloomApiHandler apiHandler)
		{
			// These are both just retrieving information about files, apart from using _bookSelection.CurrentSelection.FolderPath.
			apiHandler.RegisterEndpointHandler("dialog/close",
				(ApiRequest request) =>
				{
					BrowserDialog.CurrentDialog?.Close();
					request.PostSucceeded();
				}, true);
		}
	}
}
