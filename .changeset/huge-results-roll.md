---
"@comet/api-generator": major
"@comet/cms-admin": major
"@comet/cms-api": major
---

Introduced a strongly-typed permission system using the new CorePermission enum and Permission type, replacing previous string-based permissions.

**Breaking changes**

1. **Mandatory `requiredPermission`**: The `@CrudGenerator` decorator now requires the `requiredPermission` parameter to be explicitly specified
2. **Permission Type Changes**: All permission-related APIs now expect typed permissions instead of plain strings
