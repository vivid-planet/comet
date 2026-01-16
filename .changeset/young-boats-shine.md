---
"@comet/cms-api": minor
---

Send 401 instead 403 when CometAuthGuard cannot authenticate user

Restores the behavior of Comet v7.

Before (shortened):

```
{
  "errors": [
    {
      "message": "Forbidden resource",
      "extensions": {
        "code": "FORBIDDEN",
        "originalError": {
          "message": "Forbidden resource",
          "error": "Forbidden",
          "statusCode": 403
        }
      }
    }
  ],
  "data": null
}
```

After (shortened):

```
{
  "errors": [
    {
      "message": "No AuthService could authenticate the user",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "originalError": {
          "message": "No AuthService could authenticate the user",
          "error": "Unauthorized",
          "statusCode": 401
        }
      }
    }
  ],
  "data": null
}
```
