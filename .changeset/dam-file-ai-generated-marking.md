---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Add the ability to mark a DAM file as AI-generated

DAM files can now be flagged as AI-generated via a new `aiGeneration` field. It distinguishes the three cases covered by the official EU icon set: `AiGenerated` (general disclosure), `FullyAiGenerated`, and `PartiallyAiModified`. The type can be set in the file's settings in the Admin and is exposed on the `damFile` data of the image, SVG image and video blocks so the site can label AI-generated content.

Disclosing AI-generated or AI-manipulated content is a transparency obligation under the EU AI Act (Art. 50), which applies from 2 August 2026. A helper text in the Admin points this out. The European Commission provides official, freely usable [labelling icons](https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content) that projects can use to display the label on their site; the Demo shows an example badge with one label per type.

**Migration**

A migration adds the `aiGeneration` column to the `DamFile` table (`null` for existing files, i.e. not AI-generated).
