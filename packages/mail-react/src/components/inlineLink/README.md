# HtmlInlineLink

Outlook Desktop's built-in "Hyperlink" style overrides a bare `<a>` tag, breaking inheritance of the surrounding text's font, size, and color. `HtmlInlineLink` reads explicit text styles from its parent text component's context and applies them inline, so Outlook renders it consistent with the text around it. Modern clients that honor inheritance get the originals back via a media-query override on the block class.
