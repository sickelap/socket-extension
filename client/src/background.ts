import io, { Socket } from 'socket.io-client';

let socket: Socket;

chrome.storage.local.get(['socketUrl', 'enabled'], ({ socketUrl, enabled }) => {
  socket = io(socketUrl || 'http://localhost:3000', { autoConnect: false });
  if (enabled) {
    socket.connect();
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    /**
     * popup -> background -> content
     */
    if (changes.enabled.newValue) {
      socket.connect();
      sendMessageToActiveTab({ event: 'enable' });
    } else {
      socket.disconnect();
      sendMessageToActiveTab({ event: 'disable' });
    }
  }
});

/**
 * handle messages from content script or popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse = () => {}) => {
  if (!sender.url) {
    console.log('ignoring message from extension');
    return; // from extension
  }
  const [type, event] = message.split(':');
  switch (type) {
    case 'addListener':
      socket.on(event, (payload) => sendMessageToTab(sender.tab.id, { event, payload }));
      break;
    case 'disable':
      const disabled = { enabled: false };
      chrome.storage.local.set(disabled);
      socket.disconnect();
      sendResponse(disabled);
      break;
    case 'enable':
      const enabled = { enabled: true };
      chrome.storage.local.set(enabled);
      socket.connect();
      sendResponse(enabled);
      break;
    case 'get-counter':
      socket.emit('get-counter', (counter) => sendResponse({ event: 'counter', payload: counter }));
      break;
    case 'increment':
      socket.emit('increment', sendResponse);
      break;
    case 'decrement':
      socket.emit('decrement', sendResponse);
      break;
  }
});

const sendMessageToActiveTab = (message: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length) {
      sendMessageToTab(tabs[0].id, message);
    }
  });
};

const sendMessageToTab = (tab, message) => chrome.tabs.sendMessage(tab, message);
