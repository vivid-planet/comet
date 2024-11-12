---
"@comet/cms-api": patch
---

Prevent socket exhaustion in `BlobStorageS3Storage`

By default, the S3 client allows a maximum of 50 open sockets.
A socket is only released once a file is streamed completely.
Meaning, it can remain open forever if a file stream is interrupted (e.g., when the user leaves the site).
This could lead to socket exhaustion, preventing further file delivery.

To resolve this, the following changes were made:

1. Add a close handler to destroy the stream when the client disconnects
2. Set a 60-second `requestTimeout` to close unused connections
