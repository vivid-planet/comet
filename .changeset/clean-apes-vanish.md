---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Remove `locale`-field from `User`-object

-   Providing the locale is not mandatory for ID-Tokens
-   Does not have a real use case (better rely on the Accept-Language header of the browser to determine the language of the current user)
