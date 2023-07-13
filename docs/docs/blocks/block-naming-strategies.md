---
title: Block Naming Strategies
sidebar_position: 2
---

API &#8594 Kebab Case<br />
ADMIN &#8594 Pascal Case<br />
SITE &#8594 Pascal Case

Name blocks more like what they are rather than what they contain. This excepts basic blocks like **LinkBlock** or **HeadlineBlock**.

Naming should end with **.block** in API with Kebab Case or **Block** in Pascal Case.

## Headline Example

API:<br />
`headline.block.ts`

ADMIN:<br />
`HeadlineBlock.tsx`

SITE:<br />
`HeadlineBlock.tsx`

## FeatureList Example

API:<br />
`feature-list.block.ts`<br />
`feature-list-item.block.ts`

ADMIN:<br />
`FeatureListBlock.tsx`<br />
`FeatureListItemBlock.tsx`

SITE:<br />
`FeatureListBlock.tsx`<br />
`FeatureListItemBlock.tsx`

## Folder Structure

### API

Every block in API should be in his specific folder. This prevents endless nesting. In this folder, there is just the API block and an optional migration folder with a counted number in name at first (example: `1-add-configurable-image-settings.migration.ts`).

The folder naming is Camel Case.

#### Example (Blocks Folder)

headingSection (`heading-section.block.ts`)<br />
imageSlider (`image-slider.block.ts`)<br />
imageSliderItem (`image-slider-item.block.ts`)<br />
media (`media.block.ts`)<br />
fullWidthImage (`full-width-image.block.ts`)<br />
fullWidthImageContent (`full-width-image-content.block.ts`)

### ADMIN

No folders necessary.

#### Example (Blocks Folder)

`HeadingSectionBlock.tsx`<br />
`ImageSliderBlock.tsx`<br />
`ImageSliderItemBlock.tsx`<br />
`MediaBlock.tsx`<br />
`FullWidthImageBlock.tsx`<br />
`FulWidthImageContentBlock.tsx`

### SITE (Same as ADMIN)

No folders necessary.

#### Example (Blocks Folder)

`HeadingSectionBlock.tsx`<br />
`ImageSliderBlock.tsx`<br />
`ImageSliderItemBlock.tsx`<br />
`MediaBlock.tsx`<br />
`FullWidthImageBlock.tsx`<br />
`FulWidthImageContentBlock.tsx`<br />
