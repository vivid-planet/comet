---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add support for user impersonation

Prerequisites for setups with separate domains for admin and api: `credentials: "include"` must be set in the `createApolloClient` function in the admin.

Adds an "Impersonation" button to the detail view of a user in the User Permissions admin panel. The impersonation can be exited by clicking the button in the user's info on the top right.
