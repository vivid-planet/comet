# Brevo API error handler crashes with TypeError when error response body is not an object; Newsletter Config page crashes to error boundary

- **Severity:** major
- **Location:** Admin → Newsletter → Config — `http://localhost:8000/main/en/newsletter/config`; API package `@comet/brevo-api`
- **Affected code:** `packages/api/brevo-api/src/brevo-api/brevo-api.utils.ts:7`

## Summary

```ts
export function isErrorFromBrevo(error: unknown): error is AxiosErrorWithResponse<ErrorModel> {
    return axios.isAxiosError(error) && error.response !== undefined && "code" in error.response.data && "message" in error.response.data;
}
```

`"code" in error.response.data` throws a `TypeError` when `error.response.data` is not an object (e.g. a plain-string body, an HTML error page from a proxy/load balancer, or an empty body). The original Brevo error is then masked by `TypeError: Cannot use 'in' operator to search for 'code' in <body text>` which propagates to the GraphQL response as `INTERNAL_SERVER_ERROR`.

Observed live in this session: the outbound request to the Brevo API was answered with a `403` and a plain-text body (`Host not in allowlist`, from the sandbox egress proxy — equivalent to any intermediary returning a non-JSON body). The resolver `brevoDoubleOptInTemplates` then failed with the TypeError instead of a meaningful upstream error, and the Admin **Newsletter → Config** page crashed to the global error boundary plus a "Server error / Unknown error" dialog.

## Steps to reproduce

1. Run the demo in an environment where `api.brevo.com` is unreachable or answers with a non-JSON error body (any proxy/firewall 403, maintenance page, etc.).
2. Log in to the Demo Admin and navigate to **Newsletter → Config** (`/main/en/newsletter/config`).
3. Observe the GraphQL responses for `DoubleOptInTemplatesSelect` and `SendersSelect` and the crashed page.

## Expected vs. actual behavior

- **Expected:** `isErrorFromBrevo` safely detects whether the response body matches Brevo's `ErrorModel`; non-Brevo errors are rethrown unchanged, so the GraphQL error reflects the real upstream failure (e.g. "Request failed with status code 403"). The Config page should degrade gracefully (the Email Campaigns page, for comparison, shows a proper "Missing brevo config!" message).
- **Actual:** The type guard itself throws, masking the original error:

```
[graphql] op=DoubleOptInTemplatesSelect errors=[{"message":"Cannot use 'in' operator to search for 'code' in Host not in allowlist",
"path":["brevoDoubleOptInTemplates"],"extensions":{"code":"INTERNAL_SERVER_ERROR","stacktrace":[
"TypeError: Cannot use 'in' operator to search for 'code' in Host not in allowlist",
"    at isErrorFromBrevo (/home/user/comet/packages/api/brevo-api/src/brevo-api/brevo-api.utils.ts:7:79)",
"    at handleBrevoError (...)" ...
```

and the whole Admin page is replaced by the error boundary ("An error has occurred — ApolloError: …") plus a modal "Server error: THE FOLLOWING ERROR HAS OCCURRED: Unknown error".

## Evidence

- Screenshot (error boundary + Server error dialog): [screenshots/003-newsletter-config-server-error-dialog.png](screenshots/003-newsletter-config-server-error-dialog.png)
- Screenshot (second capture): [screenshots/003-newsletter-config-crash.png](screenshots/003-newsletter-config-crash.png)
- Screencast: [screencasts/003-brevo-config-page-crash.webm](screencasts/003-brevo-config-page-crash.webm)

## Note

The trigger in this environment is the egress proxy blocking `api.brevo.com` (environment-specific). The reported bug is the unguarded `in` operator on a possibly non-object response body, which can also be triggered in production by any non-JSON upstream error response.
