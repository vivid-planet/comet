---
"@dextinity/mail-react": major
---

Update MJML to v5 and make `renderMailHtml` asynchronous

MJML 5 renders asynchronously, so `renderMailHtml` from `@dextinity/mail-react/server` and `@dextinity/mail-react/client` now returns a promise. Await it:

```diff
- const { html, mjmlWarnings } = renderMailHtml(<MyMail />);
+ const { html, mjmlWarnings } = await renderMailHtml(<MyMail />);
```

If your application lists `mjml` in its own `package.json`, update it to v5 as well.
