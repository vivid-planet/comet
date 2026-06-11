---
"@comet/cms-api": patch
"@comet/cms-admin": patch
---

Fix duplicate TipTap `'link'` extension warning by explicitly disabling StarterKit's built-in Link extension

StarterKit (v3+) includes `@tiptap/extension-link` by default. Since we register our own `CmsLink` mark (also named `"link"`), this caused a "Duplicate extension names found: ['link']" warning. Setting `link: false` in `StarterKit.configure()` resolves this.
