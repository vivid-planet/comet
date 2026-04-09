---
"@comet/cms-api": major
---

Import blob storage backends dynamically

`BlobStorageAzureConfig`, `BlobStorageAzureStorage`, `BlobStorageFileConfig`, and `BlobStorageFileStorage` are no longer exported from `@comet/cms-api` as they are now loaded dynamically based on the configured driver. Only the relevant backend class is imported, which avoids loading unused optional dependencies (e.g., `@azure/storage-blob` or `aws-sdk`).
