---
"@comet/cms-api": minor
---

Improve undefined/null handling for updates

- Add IsUndefinable and IsNull (similar, but more specific than IsOptional from class-validator)
- Add custom PartialType (similar to @nestjs/mapped-types but uses IsUndefinable instead of IsOptional)

Update api crud generator to allow partial update in update mutation:
- null: set to null (eg. a relation or a Date)
- undefined: do not touch this field