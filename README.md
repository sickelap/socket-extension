## What is it?
This is experiment to showcase websocket connection mantained in background script of browser extension. The idea behind this is if we would want to implement extension that injects multiple applications via content script they will share same websocket extension.

## Why it's useful?
We might want to have multiple react components/applications injected in different parts of the page and all of them would need to have real time access  to backend.

## PoC features

- multiple React applications on same page
- attaching multiple applications to any page on request (via extension popup window)
- all applications use single websocket connection to backend via extension messaging
- example of persisting state (enable/disable)
- storage events

## Compatibility
In order to support as many browsers as possible browser specific API is limited to bare minimum.

Following APIs are used:

- chrome.storage.local.*
- chrome.tabs.*
- chrome.runtime.*

The extension works on Firefox, Chrome and Chromium based browsers (Chromium, Iridium, Brave, etc.). Manifest v2 for Chrome has quite good compatibility with Mozilla's. Current implementation does not require **any** manifest changes and it works out-of-the-box for both browsers.

Theoretically, with very little tweaks, it should be possible to make it work with other browsers (Edge, Safari and Opera).

## Result
![demo](https://user-images.githubusercontent.com/1636515/119200667-48d0eb00-ba85-11eb-92c2-2e8d47076103.gif)
