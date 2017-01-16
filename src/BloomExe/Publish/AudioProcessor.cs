using System;
using System.IO;
using System.Linq;
using System.Xml;
using Bloom.Edit;
using SIL.IO;
using SIL.Progress;
using SIL.Xml;

namespace Bloom.Publish
{
	public class AudioProcessor
	{

		private static LameEncoder _mp3Encoder;

		//extracted so unit test can override
		public static Func<string,string> _compressorMethod = MakeCompressedAudio;

		public AudioProcessor(EpubMaker epubMaker)
		{
		}

		public static bool IsCompressedAudioMissing(string bookFolderPath, XmlDocument dom)
		{
				return dom.SafeSelectNodes("//span[@id]")
					.Cast<XmlElement>()
					.Any(span => IsCompressedAudioForIdMissing(bookFolderPath, span.Attributes["id"].Value));
		}

		private static string GetAudioFolderPath(string bookFolderPath)
		{
			return Path.Combine(bookFolderPath, "audio");
		}

		/// <summary>
		/// Make a compressed audio file for the specified .wav file.
		/// (Or return null if it can't be done because we don't have a LAME package installed.)
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		// internal and virtual for testing.
		private static string MakeCompressedAudio(string wavPath)
		{
			// We have a recording, but not compressed. Possibly the LAME package was installed after
			// the recordings were made. Compress it now.
			if (_mp3Encoder == null)
			{
				if (!LameEncoder.IsAvailable())
				{
					return null;
				}
				_mp3Encoder = new LameEncoder();
			}
			_mp3Encoder.Encode(wavPath, wavPath.Substring(0, wavPath.Length - 4), new NullProgress());
			return Path.ChangeExtension(wavPath, "mp3");
		}

		public static string GetOrCreateCompressedAudioIfWavExists(string bookFolderPath, string recordingSegmentId)
		{
			var root = GetAudioFolderPath(bookFolderPath);
			var extensions = new [] {"mp3", "mp4"}; // .ogg,, .wav, ...?

			foreach (var ext in extensions)
			{
				var path = Path.Combine(root, Path.ChangeExtension(recordingSegmentId, ext));
				if (RobustFile.Exists(path))
					return path;
			}
			var wavPath = Path.Combine(root, Path.ChangeExtension(recordingSegmentId, "wav"));
			if (!RobustFile.Exists(wavPath))
				return null;
			return _compressorMethod(wavPath);
		}

		private static bool IsCompressedAudioForIdMissing(string bookFolderPath, string recordingSegmentId)
		{
			if (GetOrCreateCompressedAudioIfWavExists(bookFolderPath, recordingSegmentId) != null)
				return false; // not missing, we got it.
			// We consider ourselves to have a missing compressed audio if we have a wav recording
			// but no corresponding compressed waveform.
			return RobustFile.Exists(Path.Combine(GetAudioFolderPath(bookFolderPath), Path.ChangeExtension(recordingSegmentId, "wav")));
		}
	}
}
