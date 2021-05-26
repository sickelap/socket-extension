import { createContext } from 'react';

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
    chrome.runtime.sendMessage(event, callback);
  }

  on(event: string, callback: (any) => void) {
    chrome.runtime.sendMessage(`addListener:${event}`, callback);
    this.listeners.push({ event, callback });
  }
}

export const CommContext = createContext(new Comm());
