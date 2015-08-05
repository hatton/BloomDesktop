using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Bloom.web
{
	/// <summary>
	/// HTML/javascript causes actions to the model by doing a http request to a path that gets funneled here.
	/// Inspired by the FLUX Dispatcher pattern. See http://facebook.github.io/flux/docs/overview.html
	/// 
	/// </summary>
	public class Dispatcher
	{
		private readonly CommandReceivedEvent _commandReceivedEvent;
		private readonly DuplicatePageCommand _duplicatePageCommand;
		private readonly DeletePageCommand _deletePageCommand;

		public Dispatcher(CommandReceivedEvent commandReceivedEvent, DuplicatePageCommand duplicatePageCommand,
			DeletePageCommand deletePageCommand)
		{
			_commandReceivedEvent = commandReceivedEvent;
			_duplicatePageCommand = duplicatePageCommand;
			_deletePageCommand = deletePageCommand;
		}

		public bool Dispatch(string localPath)
		{
			switch (localPath.Replace("command/book/",""))
			{
				case "duplicateCurrentPage":
					if (_duplicatePageCommand.Enabled)
					{
						_commandReceivedEvent.Raise(_duplicatePageCommand);
					}
					break;
				case "deleteCurrentPage":
					if (_deletePageCommand.Enabled)
					{
						_commandReceivedEvent.Raise(_deletePageCommand);
					}
					break;
			}
			
			return true;
		}

		public  Event<Command> CommandGiven;
	}
}
