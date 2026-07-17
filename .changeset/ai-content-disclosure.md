---
"@comet/cms-api": minor
"@comet/cms-admin": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add AI content disclosure for DAM assets (EU AI Act, Article 50)

Editors can mark a DAM asset as **AI generated** or **AI modified** in the file settings. When such an asset is published, the site renders the official EU AI-content label and merges the disclosure into the media element's accessible name, so screen-reader users learn which asset is AI.

**API**

New `aiContentType` field (`Generated` | `Modified`) on DAM files, exposed through the `PixelImage` and `DamVideo` blocks.

**Admin**

New "AI content" field in the DAM file settings, shown for image, video and audio assets only (other file types cannot constitute a deep fake).

**Site**

`PixelImageBlock` and `DamVideoBlock` render the disclosure automatically for marked assets. Both accept props to customize it:

- `aiContentDisclosureProps` — override the badge.
- `customAiContentDisclosure` — render your own disclosure, or `null` for none.
- `aiContentAltTextLabels` — localize the accessible-name prefix (defaults to English).

`@comet/site-react` also exports the `AiContentDisclosure` badge and the `getAiContentAltText` helper.
