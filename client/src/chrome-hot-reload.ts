if (typeof chrome !== 'undefined') {
  const filesInDirectory = (dir: DirectoryEntry) =>
    new Promise((resolve) =>
      dir.createReader().readEntries((entries) =>
        Promise.all(
          entries
            .filter((e) => e.name[0] !== '.')
            .map((e) =>
              e.isDirectory
                ? filesInDirectory(e as DirectoryEntry)
                : new Promise((resolve) => (e as FileEntry).file(resolve))
            )
        )
          .then((files: FileEntry[]) => [].concat(...files) as DirectoryEntry[])
          .then(resolve)
      )
    );

  const timestampForFilesInDirectory = (dir: DirectoryEntry) =>
    filesInDirectory(dir).then((files) => files.map((f) => f.name + f.lastModifiedDate).join());

  const watchChanges = (dir: DirectoryEntry, lastTimestamp?: number) => {
    timestampForFilesInDirectory(dir).then((timestamp) => {
      if (!lastTimestamp || lastTimestamp === timestamp) {
        setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
      } else {
        chrome.runtime.reload();
      }
    });
  };

  chrome.management.getSelf((self) => {
    if (self.installType === 'development') {
      chrome.runtime.getPackageDirectoryEntry((dir: DirectoryEntry) => watchChanges(dir));
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        // NB: see https://github.com/xpl/crx-hotreload/issues/5
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });
}
