using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Bloom.web;
using Gecko;

namespace Bloom.Edit
{
	public partial class BookCommandBar : UserControl
	{
		private readonly NavigationIsolator _isolator;
		private readonly Browser _browser;

		public BookCommandBar(NavigationIsolator isolator, DuplicatePageCommand duplicatePageCommand, DeletePageCommand deletePageCommand)
		{
			_isolator = isolator;
			InitializeComponent();

			if(!ReallyDesignMode)
			{
				_browser = new Browser();
				this._browser.Dock = DockStyle.Fill;
				//this._browser.Size = new System.Drawing.Size(150, 491);
				this.Controls.Add(_browser);

				duplicatePageCommand.EnabledChanged+=UpdateDisplay;
				deletePageCommand.EnabledChanged += UpdateDisplay;
			}
		}

		private void UpdateDisplay(object command, EventArgs eventArgs)
		{
			//This is temporary: Eventually, we want to look at using react to let model changes like this touch the dom
			
			var cmd = ((Command) command);
			var enabled = cmd.CssName + "-enabled";
			var disabled = cmd.CssName + "-disabled";
			var c = _browser.WebBrowser.Document.Body.GetAttribute("class") ?? "";
			var current = cmd.Enabled ? enabled : disabled;
			c = c.Replace(enabled, "").Replace(disabled, "") + " " + current;
			_browser.WebBrowser.Document.Body.SetAttribute("class", c);
		}


		protected bool ReallyDesignMode
		{
			get
			{
				return (base.DesignMode || GetService(typeof(IDesignerHost)) != null) ||
					(LicenseManager.UsageMode == LicenseUsageMode.Designtime);
			}
		}

		private void BookCommandBar_Load(object sender, EventArgs e)
		{
			_browser.Isolator = _isolator;
			_browser.Navigate(ServerBase.PathEndingInSlash + "/bookEdit/BookCommandBar/BookCommandBar.htm", false);

		
		}

		private void _updateAvailabilityTimer_Tick(object sender, EventArgs e)
		{
			
		}
	}
}
