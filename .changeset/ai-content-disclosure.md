---
"@comet/cms-api": minor
"@comet/cms-admin": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add AI content disclosure for DAM assets (EU AI Act, Article 50)

Editors can now mark a DAM asset as **AI generated** or **AI modified** in the file settings. When such an asset is published, the site renders the official EU AI-content label and merges the disclosure into the media element's accessible name, so screen-reader users learn which asset is AI-generated.

**API**

A new `aiContentType` field (`Generated` | `Modified`) is available on DAM files and is exposed through the `PixelImage`, `SvgImage` and `DamVideo` blocks.

**Admin**

The DAM file form has a new "AI content" field to set the disclosure.

**Site**

`@comet/site-react` exports the `AiContentDisclosure` badge component and the `getAiContentAltText` helper. The `PixelImageBlock`, `SvgImageBlock` and `DamVideoBlock` render the disclosure automatically when the asset is marked as AI content.

The badge uses the official EU AI-content labels.
