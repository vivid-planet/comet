---
"@dextinity/icons": minor
---

Add `@dextinity/icons`, a React icon library

Every icon renders an `<svg>` element. An icon is 16×16 pixels and uses the current text color.

**Example**

```tsx
import { Accept } from "@dextinity/icons";

<Accept aria-label="Accepted" />;
```

**Size and color**

```css
/* styles.module.css */
.largeIcon {
    width: 32px;
    height: 32px;
    color: royalblue;
}
```

```tsx
<Accept className={styles.largeIcon} />
```
