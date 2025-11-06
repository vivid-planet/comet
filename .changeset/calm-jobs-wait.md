---
"@comet/cms-admin": patch
---

Make all scopes selectable / de-selectable in the "Permission-specific Content-Scopes" dialog

**Following scenario:**

A user has the following scopes by rule:

```ts
[
    { domain: "main", language: "en" },
    { domain: "main", language: "de" },
];
```

I want to manually assign them the permission `products` but only for the scope `{ domain: "main", language: "de" }`.

Previously, this wasn't possible because when assigning specific scopes for a permission, the scopes a user already had couldn’t be deselected. (In our scenario, I couldn’t deselect `{ domain: "main", language: "en" }`. So I had no other choice but giving the user the `products` permission for both scopes.)

Now, all scopes are selectable / de-selectable in the dialog. So in our scenario, I can now assign the `products` permission only for `{ domain: "main", language: "de" }`.
