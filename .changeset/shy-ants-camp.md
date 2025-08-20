---
"@comet/admin-generator": patch
---

Fix generating too many props for grid-component

This happened if there was a required root gql-arg for the corresponding create-mutation to support copy/paste.
