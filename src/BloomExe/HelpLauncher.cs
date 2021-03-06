﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using SIL.IO;

namespace Bloom
{
	public class HelpLauncher
	{
		public static void Show(Control parent)
		{
			Help.ShowHelp(parent, FileLocator.GetFileDistributedWithApplication("Bloom.chm"));
		}
		public static void Show(Control parent, string topic)
		{
			Show(parent, "Bloom.chm", topic);
		}

		public static void Show(Control parent, string helpFileName, string topic)
		{
			Help.ShowHelp(parent, FileLocator.GetFileDistributedWithApplication(helpFileName), topic);
		}
	}
}
