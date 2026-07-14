---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add the ability to mark a DAM file as AI-generated

DAM files can now be flagged as AI-generated via a new `isAiGenerated` field. The flag can be set in the file's settings in the Admin and is exposed on the `damFile` data of the image, SVG image and video blocks so the site can label AI-generated content.

Marking AI-generated or AI-manipulated content is a transparency obligation under the EU AI Act (Art. 50), which applies from 2 August 2026. A helper text in the Admin points this out. The European Commission provides official, freely usable [labelling icons](https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content) that projects can use to display the label on their site; the Demo shows an example badge.

**Migration**

A migration adds the `isAiGenerated` column to the `DamFile` table (defaulting to `false` for existing files).
