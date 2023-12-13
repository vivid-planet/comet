---
"@comet/blocks-admin": minor
---

Add support for custom block categories

Minimal example:

```tsx
const MyBlock: BlockInterface = {
    category: {
        id: "Products",
        label: <FormattedMessage id="blocks.category.products" defaultMessage="Products" />,
        insertBefore: BlockCategory.Teaser,
    },
    ...
};
```

Use `insertBefore` to specify where the custom block category will be shown in the `AddBlockDrawer`.

Although it is possible to define a custom block category at the block level, we recommend to define it in a central place for better reusability instead.

In `src/common/blocks/customBlockCategories.tsx`:

```tsx
import { BlockCategory, CustomBlockCategory } from "@comet/blocks-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

const productsBlockCategory: CustomBlockCategory = {
    id: "Products",
    label: <FormattedMessage id="blocks.category.products" defaultMessage="Products" />,
    insertBefore: BlockCategory.Teaser,
};

export { productsBlockCategory };
```

In `src/documents/pages/blocks/MyBlock.tsx`:

```tsx
import { productsBlockCategory } from "@src/common/blocks/customBlockCategories";

const MyBlock: BlockInterface = {
    category: productsBlockCategory,
    ...
};
```
