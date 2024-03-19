---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

createImageLinkBlock: Allow overriding name

This allows using two different `ImageLink` blocks in one application.

Perform the following steps to override the name:

1. API: Add the name as second argument in the `createImageLinkBlock` factory:

    ```diff
    const MyCustomImageLinkBlock = createImageLinkBlock(
        { link: InternalLinkBlock },
    +   "MyCustomImageLink"
    );
    ```

2. Admin: Set the `name` option in the `createImageLinkBlock` factory:

    ```diff
    const MyCustomImageLinkBlock = createImageLinkBlock({
        link: InternalLinkBlock,
    +   name: "MyCustomImageLink"
    });
    ```
