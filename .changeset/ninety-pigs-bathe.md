---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Fix schema generation if `FileUpload` object type isn't used

Previously, the file uploads module always added the `downloadUrl` and `imageUrl` fields to the `FileUpload` object type, even if the type wasn't used in the application.
This lead to errors when generating the GraphQL schema.

Now, the fields are only added if the `download` option of the module is used.

Note: As a consequence, the `finalFormFileUploadFragment` doesn't include the fields anymore.
To enable downloading file uploads in forms, use the newly added `finalFormFileUploadDownloadableFragment`:

```diff
export const productFormFragment = gql`
    fragment ProductFormFragment on Product {
        priceList {
-           ...FinalFormFileUpload
+           ...FinalFormFileUploadDownloadable
        }
    }

-   ${finalFormFileUploadFragment}
+   ${finalFormFileUploadDownloadableFragment}
`;
```
