---
"@comet/admin": major
"@comet/admin-color-picker": major
"@comet/admin-date-time": major
"@comet/cms-admin": major
---

Remove `hasClearableContent` prop from `ClearInputAdornment`

The component now always renders when included in the component tree. Callers should conditionally render the component instead of passing the `hasClearableContent` prop.

**Migration:**

Before:

```tsx
<ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange("")} />
```

After:

```tsx
{
    value && <ClearInputAdornment position="end" onClick={() => onChange("")} />;
}
```
