---
"@comet/cms-api": major
---

API Generator: replace generated service with getFindCondition with a runtime function that gets searchable fields from meta data

Use new `mikroOrmQuery` function to use the runtime based field detection

Now the service is not generated anymore, when updating remove it from the nestjs module
