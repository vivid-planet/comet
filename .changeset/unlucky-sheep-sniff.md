---
"@comet/admin": major
---

Adjust the type of the `title` prop in `Stack` and `Switch` components

This is a part of a fix to avoid rerender loops that occur in the following scenario, when the title is passed as react component.

```tsx
<Stack topLevelTitle="test title">
        {/* A component passed as title in the construct below is what caused the loop */}
        <StackPage name="page2">
            {(id) => {
                return (
                    <StackPageTitle title={<FormattedMessage id="page2" defaultMessage="Page 2" />}>
                        <Typography variant="h2">Page 2</Typography>
                        <Typography>ID: {id}</Typography>
                    </StackPageTitle>
                );
            }}
        </StackPage>
</Stack>
```

The fix includes only accepting a `string` or the `FormattedMessage` component. The latter one will automatically be converted to a string, when saving it to the state.

**Examples:**
```tsx
<StackPage name="page1" title="page">
    <Typography variant="h1">Page 1</Typography>
</StackPage>
```
```tsx
<StackPage name="page1" title={<FormattedMessage id="page1" defaultMessage="Page 1" />}>
    <Typography variant="h1">Page 1</Typography>
</StackPage>
```

**No working example:**
```tsx
<StackPage name="page1" title={<Typography>Page 1</Typography>}>
    <Typography variant="h1">Page 1</Typography>
</StackPage>
```