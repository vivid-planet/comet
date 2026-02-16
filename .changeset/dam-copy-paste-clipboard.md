---
"@comet/cms-api": minor
"@comet/cms-admin": minor
"@comet/admin": minor
---

Add copy/paste functionality to the DAM via browser clipboard

API:

- Add `copyDamFiles` mutation for copying files to a target folder with automatic duplicate name prevention
- Add `copyDamFolders` mutation for recursively deep-copying folders including all files and sub folders
- Deprecate `copyFilesToScope` in favor of `copyDamFiles`
- Add `findNextAvailableFolderName` to FoldersService for deduplicating folder names

Admin:

- Add `useCopyPasteDamItems` hook for clipboard read/write and paste operations
- Add Copy and Paste actions to DAM context menu (right-click on files and folders)
- Add Copy and Paste actions to DAM toolbar (multi-select actions menu)
- Add `failedToReadClipboard` and `emptyClipboard` messages to `@comet/admin`
