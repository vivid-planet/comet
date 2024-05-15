---
"@comet/admin": minor
---

Add `FinalFormAsyncSelect` and `FinalFormAsyncAutocomplete` components

Thin wrappers to ease using `useAsyncOptionsProps()` with `FinalFormSelect` and `FinalFormAutocomplete`.

**Example**

Previously:

```tsx
const asyncOptionsProps = useAsyncOptionsProps(async () => {
    // Load options here
});

// ...

<Field component={FinalFormAsyncAutocomplete} {...asyncOptionsProps} />;
```

Now:

```tsx
<Field
    component={FinalFormAsyncAutocomplete}
    loadOptions={async () => {
        // Load options here
    }}
/>
```
