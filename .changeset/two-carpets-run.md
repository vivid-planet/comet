---
"@comet/blocks-admin": minor
---

Add support for custom block categories

Allows specifying custom block categories in application code.

**Example:**

In `src/common/blocks/customBlockCategories.tsx`:

```tsx
import { BlockCategory, CustomBlockCategory } from "@comet/blocks-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

const productsBlockCategory: CustomBlockCategory = {
    id: "Products",
    label: <FormattedMessage id="blocks.category.products" defaultMessage="Products" />,
    // Specify where category will be shown in drawer
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
