---
"@comet/cms-api": major
---

API Generator: Remove generated service

The `Service#getFindCondition` method is replaced with the new `gqlArgsToMikroOrmQuery` function, which detects an entity's searchable fields from its metadata.
Consequently, the generated service isn't needed anymore and will therefore no longer be generated.
Remove the service from the module after re-running the API Generator.
