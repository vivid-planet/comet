---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Require a file extension when changing the filename in the DAM

Previously, files in the DAM could be renamed without restrictions.
Files could have invalid extensions (for their mimetype) or no extension at all.
This theoretically made the following attack possible:

1. Creating a dangerous .exe file locally
2. Renaming it to .jpg locally
3. Uploading the file as a .jpg
4. Renaming it to .exe in the DAM
5. The file is now downloaded as .exe

Now, filenames must always have an extension that matches their mimetype.
This is enforced in the admin and API.
Existing files without an extension are automatically assigned an extension via a DB migration.
