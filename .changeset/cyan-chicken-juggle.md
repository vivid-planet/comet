---
"@comet/cms-admin": minor
---

Add `buttonChildren` and `children` props to `UserHeaderItem`

This increases the flexibility of the `UserHeaderItem` component by allowing the `AppHeaderDropdown` label to be passed via `buttonChildren`. More buttons or other list items in the dropdown can be passed via `children`.

**Example:**
```tsx
<UserHeaderItem buttonChildren="Some custom label">
    <Button variant="contained">Some custom button</Button>
    <Button>Some custom button 2</Button>
</UserHeaderItem>
```