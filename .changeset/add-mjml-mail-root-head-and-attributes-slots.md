---
"@comet/mail-react": minor
---

Add `head` and `attributes` props to `MjmlMailRoot`

- `head` — `ReactNode` appended inside `<MjmlHead>` after the registered styles block.
- `attributes` — `ReactNode` appended inside `<MjmlAttributes>` after the default `<MjmlAll>`.

```tsx
<MjmlMailRoot attributes={<MjmlClass name="link" color="blue" />} head={<MjmlFont name="Foo" href="https://example.com/foo.css" />}>
    {/* email body */}
</MjmlMailRoot>
```
