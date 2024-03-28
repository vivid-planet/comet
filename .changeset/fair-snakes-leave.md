---
"@comet/blocks-admin": minor
"@comet/cms-admin": minor
"@comet/blocks-api": minor
"@comet/cms-site": minor
"@comet/cms-api": minor
---

Add `title` field to link block

Perform the following steps to use it in an application:

1. API: Use the new `createLinkBlock` factory to create the LinkBlock:

    ```ts
    import { createLinkBlock } from "@comet/cms-api";

    // ...

    const LinkBlock = createLinkBlock({
        supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
    });
    ```

2. Site: Pass the `title` prop to LinkBlock's child blocks:

```diff
const supportedBlocks: SupportedBlocks = {
-   internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
+   internal: ({ children, title, ...props }) => <InternalLinkBlock data={props} title={title}>{children}</InternalLinkBlock>,
    // ...
};
```
