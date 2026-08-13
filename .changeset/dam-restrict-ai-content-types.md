---
"@comet/cms-admin": minor
---

Add `aiContentTypes` to the DAM config to restrict the AI content types editors can choose from

Previously, the **AI content** field in the DAM file settings always offered both `Generated` and `Modified`, and there was no way to hide the field.
Projects that only need one of the types (or none at all) can now configure which types are available:

**Example**

```tsx
// In App.tsx
<CometConfigProvider
    dam={{
        // Other DAM config
        aiContentTypes: ["Generated"],
    }}
>
```

Pass an empty array to hide the **AI content** field entirely.
It defaults to all types, so existing projects are unaffected.

A type that is already set on an asset stays selectable, even if it isn't configured, so existing values aren't changed silently.
