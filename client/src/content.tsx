import React from 'react';
import { render } from 'react-dom';
import { Sender } from './components/Sender';
import { Receiver } from './components/Receiver';

const loadComponents = () => {
  chrome.storage.local.get(['enabled'], (storage) => {
    if (storage['enabled'] === true) {
      const sender = document.getElementById('sender-root');
      if (!sender) {
        const senderRoot = document.createElement('div');
        senderRoot.id = 'sender-root';
        document.querySelector('body').appendChild(senderRoot);
        render(<Sender />, senderRoot);
      }
      const receiver = document.getElementById('receiver-root');
      if (!receiver) {
        const receiverRoot = document.createElement('div');
        receiverRoot.id = 'receiver-root';
        document.querySelector('body').appendChild(receiverRoot);
        render(<Receiver />, receiverRoot);
      }
    }
  });
};

const unloadComponents = () => {
  const sender = document.getElementById('sender-root');
  if (sender) {
    sender.parentNode.removeChild(sender);
  }
  const receiver = document.getElementById('receiver-root');
  if (receiver) {
    receiver.parentNode.removeChild(receiver);
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.event) {
    case 'enable':
      loadComponents();
      break;

    case 'disable':
      unloadComponents();
      break;
  }
});

loadComponents();
