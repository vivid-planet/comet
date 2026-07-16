---
"@comet/cms-api": minor
"@comet/cms-admin": minor
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Add AI content disclosure for DAM assets (EU AI Act, Article 50)

Editors can now mark a DAM asset as **AI generated** or **AI modified** in the file settings. When such an asset is published, the site renders the official EU AI-content label and merges the disclosure into the media element's accessible name, so screen-reader users learn which asset is AI-generated.

**API**

A new `aiContentType` field (`Generated` | `Modified`) is available on DAM files and is exposed through the `PixelImage` and `DamVideo` blocks.

**Admin**

The DAM file form has a new "AI content" field to set the disclosure. It is shown for image, video and audio assets only, as other file types (e.g. SVGs, documents) cannot constitute a deep fake.

**Site**

`@comet/site-react` exports the `AiContentDisclosure` badge component and the `getAiContentAltText` helper. The `PixelImageBlock` and `DamVideoBlock` render the disclosure automatically when the asset is marked as AI content. SVG images are not covered, as vector graphics cannot constitute a deep fake.

The badge uses the official EU AI-content labels. Both blocks accept props to customize the disclosure: `aiContentDisclosureProps` to override the badge, `customAiContentDisclosure` to render your own (or `null` for none), and `aiContentAltTextLabels` to localize the AI content prefix added to the accessible name (defaults to English).
