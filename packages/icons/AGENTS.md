# Adding an icon

Write the icon as a component in `src/icons/`:

- `IconBase` renders the `<svg>` element, so the component renders only its children. If the `<svg>` element sets `fill`, `stroke` or `stroke-width`, move them to the children, because `IconBase` doesn't take them over.
- The `viewBox` must be `0 0 16 16`. For any other size, ask for a 16×16 version instead of scaling it.
- Give the icon a PascalCase name and search terms. A file name can give both: `AddFilled_Plus_Circle.svg` becomes `AddFilled` with `searchTerms: ["Plus", "Circle"]`. If it gives no name, ask for one.
- An icon drawn in one color uses `currentColor`. An icon drawn in several colors keeps them.
- Prefix every `id` with `dextinity-` and the component name in lower camelCase, for example `dextinity-addFilled-clip0`. Ids are global on the page, so two icons could otherwise use each other's clip path.

For example, `AddFilled_Plus_Circle.svg`:

```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8C15 11.866 11.866 15 8 15…" fill-rule="evenodd" clip-rule="evenodd" fill="black"/>
</svg>
```

becomes `src/icons/AddFilled.tsx`:

```tsx
import { forwardRef } from "react";

import { IconBase, type IconComponent, type IconProps } from "../IconBase.js";

export const AddFilled: IconComponent = Object.assign(
    forwardRef<SVGSVGElement, IconProps>(function AddFilled(props, ref) {
        return (
            <IconBase {...props} ref={ref}>
                <path d="M15 8C15 11.866 11.866 15 8 15…" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </IconBase>
        );
    }),
    { searchTerms: ["Plus", "Circle"] },
);
```
