---
"@comet/admin": minor
---

Add new `FileSelect`, `FileDropzone` and `FileSelectListItem` components

`FileSelect` combines `FileDropzone` and `FileSelectListItem` to handle the user's selection of files, display those files below, and handle the download and removal actions.

`FileDropzone` is a wrapper around [react-dropzone](https://www.npmjs.com/package/react-dropzone) that manages error and disabled states.

`FileSelectListItem` is used to display a list of files, including loading, skeleton, and error states and options to download and delete the file.
