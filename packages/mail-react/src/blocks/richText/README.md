# Rich text

Each editor stores CMS rich text differently, so each one gets its own block factory in a subdirectory. Every factory renders the markup here, down to the `richTextBlock__*` class names, which keeps an application's CSS working when the editor changes.
