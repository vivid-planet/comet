---
"@comet/admin": patch
---

Allow passing a mix of elements and arrays to `Tabs` and `RouterTabs` as children

For example:

```tsx
<RouterTabs>
    <RouterTab label="One" path="">
        One
    </RouterTab>
    {content.map((value) => (
        <RouterTab key={value} label={value} path={`/${value}`}>
            {value}
        </RouterTab>
    ))}
    {showFourthTab && (
        <RouterTab label="Four" path="/four">
            Four
        </RouterTab>
    )}
</RouterTabs>
```