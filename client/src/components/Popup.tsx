import React, { useEffect, useState } from 'react';
import './Popup.scss';

export function Popup() {
  const [enabled, setEnabled] = useState(false);
  const onClick = () => chrome.storage.local.set({ enabled: !enabled }, () => setEnabled(!enabled));

  useEffect(() => {
    chrome.storage.local.get(['enabled'], ({ enabled }) => setEnabled(enabled));
  }, [enabled]);

  return (
    <div id="popup-container">
      <div>Status: {enabled ? 'Enabled' : 'Disabled'}</div>
      <button onClick={onClick}>{enabled ? 'Disable' : 'Enable'}</button>
    </div>
  );
}
