# FORBIDDEN GraphQL errors are presented as "Your login-session has expired" dialog

- **Severity:** major
- **Location:** Admin → System → Publisher / Cron Jobs — `http://localhost:8000/main/en/system/publisher`, `/main/en/system/cron-jobs` (any page that receives a `FORBIDDEN` GraphQL error)
- **Affected code:** `packages/admin/admin/src/error/errordialog/createErrorDialogApolloLink.tsx:23-26`

## Summary

The error-dialog Apollo link maps GraphQL error codes to dialog types like this:

```ts
if (graphQLErrors.some((e) => e.extensions?.code === "FORBIDDEN")) {
    errorType = "unauthenticated"; // Error is triggered by Comet Guard
} else if (graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED")) {
    errorType = "unauthorized"; // Error is triggered by UnauthorizedException
}
```

The mapping is inverted relative to the error semantics: a **403 FORBIDDEN** (authorization failure — the user _is_ logged in but lacks access) produces the `unauthenticated` dialog titled **"Unauthenticated"** with the message **"Your login-session has expired."** and a **Re-login** button. Conversely, an `UNAUTHENTICATED` error shows "You are not authorized to perform this action."

In the demo this is easy to trigger: locally (without Kubernetes) the `builds`/`kubernetesCronJobs` queries are rejected by `KubernetesAuthenticationGuard` with `FORBIDDEN`, and a fully logged-in admin is told their session expired. Clicking "Re-login" (href `/`) does not help — the dialog reappears on every visit, which is actively misleading for users and support.

## Steps to reproduce

1. Run the demo locally (no Kubernetes available) and log in to the Demo Admin as "Admin".
2. Navigate to **System → Publisher** (`/main/en/system/publisher`) or **System → Cron Jobs**.
3. Observe the dialog and the red error banner.

## Expected vs. actual behavior

- **Expected:** A 403/FORBIDDEN response shows an authorization message ("You are not authorized…"), not a session-expiry prompt. A session expiry (401/UNAUTHENTICATED) is the case that should offer "Re-login".
- **Actual:** The logged-in user gets a modal titled "Unauthenticated" with "Your login-session has expired." and a Re-login button; behind it, the page is replaced by the error boundary "An error has occurred — ApolloError: Forbidden resource".

## Console / network / GraphQL output

```
[graphql] op=Builds errors=[{"message":"Forbidden resource","path":["builds"],
"extensions":{"code":"FORBIDDEN","stacktrace":["ForbiddenException: Forbidden resource", ...

[console.error] Error caught by error boundary ApolloError: Forbidden resource
```

## Evidence

- Screenshot (dialog): [screenshots/002-publisher-session-expired-dialog.png](screenshots/002-publisher-session-expired-dialog.png)
- Screenshot (error banner + dialog): [screenshots/002-publisher-error-banner-and-dialog.png](screenshots/002-publisher-error-banner-and-dialog.png)
- Screencast: [screencasts/002-forbidden-shown-as-session-expired.webm](screencasts/002-forbidden-shown-as-session-expired.webm)

## Note

The underlying `FORBIDDEN` on Publisher/Cron Jobs in local dev is environment-specific (no Kubernetes). The reported bug is the swapped FORBIDDEN/UNAUTHENTICATED → dialog mapping, which affects every project using `@comet/admin`.
