﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace Bloom.Publish
{
	/// <summary>
	/// Set of up to four files useful for a given font name
	/// </summary>
	class FontGroup : IEnumerable<string>
	{
		public string Normal;
		public string Bold;
		public string Italic;
		public string BoldItalic;

		public void Add(GlyphTypeface gtf, string path)
		{
			if (Normal == null)
				Normal = path;
			if (gtf.Style == System.Windows.FontStyles.Italic)
			{
				if (isBoldFont(gtf))
					BoldItalic = path;
				else
					Italic = path;
			}
			else
			{
				if (isBoldFont(gtf))
					Bold = path;
				else
					Normal = path;
			}
		}

		private static bool isBoldFont(GlyphTypeface gtf)
		{
			return gtf.Weight.ToOpenTypeWeight() > 600;
		}

		public IEnumerator<string> GetEnumerator()
		{
			if (Normal != null)
				yield return Normal;
			if (Bold != null)
				yield return Bold;
			if (Italic != null)
				yield return Italic;
			if (BoldItalic != null)
				yield return BoldItalic;
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return GetEnumerator();
		}
	}
}