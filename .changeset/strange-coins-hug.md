---
"@comet/admin": minor
---

Automatically set `fullWidth` for `FieldContainer` with `variant="horizontal"`

Horizontal fields are automatically responsive:
If they are less than 600px wide, the layout automatically changes to vertical.
For this to work correctly, the fields must be `fullWidth`.
Therefore, `fullWidth` is now `true` by default for horizontal fields.
