---
"@dextinity/ui": minor
---

Add the experimental `@dextinity/ui` package

The package provides themeable React UI primitives that don't depend on MUI or Emotion, so they work in the admin, the site and prototypes alike. They're built on [Base UI](https://base-ui.com/) and styled with CSS Modules. A theme is a stylesheet of CSS custom properties; the package includes the Dextinity theme.

The package is experimental: its components may change or be removed without a deprecation notice.

**Example**

```sh
pnpm add @dextinity/ui @base-ui/react
```

```tsx
// Once, at the root of the application
import "@dextinity/ui/css";
import "@dextinity/ui/themes/dextinity.css";
```

```html
<html data-dextinity-theme="dextinity" data-dextinity-color-scheme="light"></html>
```

```tsx
import { Button, TextField } from "@dextinity/ui";

<form onSubmit={handleSubmit}>
    <TextField label="Email" type="email" name="email" required />
    <Button type="submit">Subscribe</Button>
</form>;
```
