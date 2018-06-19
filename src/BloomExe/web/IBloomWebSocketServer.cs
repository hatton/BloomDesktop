using System.ComponentModel;

namespace Bloom.web
{
	public interface IBloomWebSocketServer
	{
		void Send(string clientContext, string eventId, string eventData);
		void Init(string port);
		void Dispose();
	}
}
