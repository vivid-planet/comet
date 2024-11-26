---
"@comet/cms-site": patch
---

The `graphQLFetch` helper for block preview uses `credentials: "include"`

This is necessary for the block preview when using block loaders because they load the data from the API on the client side.
