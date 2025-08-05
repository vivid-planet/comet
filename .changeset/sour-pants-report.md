---
"@comet/cms-api": patch
---

Fix copying a file from one scope to another

Previously, the media alternatives weren't handled when copying a file (which happens automatically when copying a page from one scope to another). This caused this error:

> ERROR [ExceptionFilter] DriverException: update "DamMediaAlternative" set "for" = 'eb2a6906-eef9-425c-9d46-1f76275f4ca5', "alternative" = 'eb2a6906-eef9-425c-9d46-1f76275f4ca5' where "id" = '[object Object]' - invalid input syntax for type uuid: "[object Object]"
