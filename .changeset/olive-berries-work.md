---
"@comet/blocks-admin": minor
"@comet/cms-admin": minor
"@comet/admin": minor
---

Add the method `extractTextContents` to extract text contents of blocks and `replaceTextContents` to import and replace text contents of blocks. These two methods are accessible through two new page actions `Extract Content` and `Import Content` from the page menu. `Extract content` inserts the text content of the blocks as csv into the clipboard and `Import content` takes csv data from the clipboard and replaces the respective texts in blocks. To ensure that inline styles and entity ranges are preserved during import, they are marked with corresponding tags during export.
