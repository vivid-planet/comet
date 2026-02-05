---
"@comet/api-generator": minor
---

Stop generating GraphQL selection-set based `populate` handling in generated CRUD list resolvers.

MikroORM dataloader must now be enabled in API projects (for example with `dataloader: DataloaderType.ALL` in your MikroORM config) to efficiently resolve relation fields.
