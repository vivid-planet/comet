---
"@comet/blocks-admin": minor
"@comet/blocks-api": minor
---

Add `createSpaceBlock` factory

Allows selecting a spacing value out of a list of provided options.

**Example Admin:**
```tsx
const options = [
    { value: "d150", label: "Dynamic 150" },
    { value: "d200", label: "Dynamic 200" },
];

export const SpaceBlock = createSpaceBlock<string>({ defaultValue: options[0].value, options });
```

**Example Api:**
```tsx
enum Spacing {
    d150 = "d150",
    d200 = "d200",
}

export const SpaceBlock = createSpaceBlock({ spacing: Spacing }, "DemoSpace");
```
