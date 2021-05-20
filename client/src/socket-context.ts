import * as React from 'react';

class Comm {
  listeners: { event: string; callback: (any) => void }[] = [];

  constructor() {
    chrome.runtime.onMessage.addListener((message) => {
      this.listeners
        .filter((listener) => listener.event === message.event)
        .forEach((listener) => listener.callback(message.payload));
    });
  }

  emit(event: string, callback?: (any) => void) {
    chrome.runtime.sendMessage({ event }, callback);
  }

  on(event: string, callback: (any) => void) {
    if (!this.listeners.find((listener) => listener.event === event)) {
      chrome.runtime.sendMessage({ event: 'listen', name: event }, callback);
    }
    this.listeners.push({ event, callback });
  }
}

export const CommContext = React.createContext(new Comm());
