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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!sender.url) {
    console.log('ignoring message from extension');
    return; // from extension
  }
  switch (message.event) {
    case 'listen':
      socket.on(message.name, (payload) => {
        sendMessageToActiveTab({ event: message.name, payload });
        // sendResponse();
      });
      break;
    case 'disable':
      chrome.storage.local.set({ enabled: false });
      socket.disconnect();
      sendResponse();
      break;
    case 'enable':
      chrome.storage.local.set({ enabled: true });
      socket.connect();
      sendResponse();
      break;
    case 'get-counter':
      socket.emit('get-counter', sendResponse);
      break;
    case 'increment':
      socket.emit('increment', sendResponse);
      break;
    case 'decrement':
      socket.emit('decrement', sendResponse);
      break;
  }
});

const sendMessageToActiveTab = (message: any, callback?: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length) {
      chrome.tabs.sendMessage(tabs[0].id, message, callback);
    }
  });
};
