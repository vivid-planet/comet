---
"@comet/cms-admin": patch
---

Fix `TipTapRichTextBlock` toolbar colors to match the existing `RichTextBlock` toolbar

The TipTap toolbar incorrectly used Comet's `greyPalette` (where `greyPalette[100]` is `#D9D9D9`) for the toolbar background, button icon, hover, and disabled states. This made the toolbar look noticeably darker than the existing Draft.js-based `RichTextBlock` toolbar, which uses MUI's lighter `grey` palette (`grey[100]` is `#F5F5F5`). The TipTap toolbar now uses the same MUI grey shades for these states so the two toolbars look consistent.
