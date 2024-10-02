---
"@comet/cms-admin": minor
"@comet/admin": minor
"@comet/cms-api": minor
---

File Uploads: Add image endpoint

Add support for viewing images in the browser.
This can be useful for file upload previews, profile pictures etc.
The image URL can be obtained by querying the `imageUrl` field of the `FileUpload` type.
A `resizeWidth` argument needs to be provided.

**Example**

```graphql
query Product($id: ID!) {
    product(id: $id) {
        id
        updatedAt
        priceList {
            id
            imageUrl(resizeWidth: 640)
        }
    }
}
```
