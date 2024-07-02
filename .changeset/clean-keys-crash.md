---
"@comet/cms-api": minor
---

API Generator: Make paginated list response optional

Setting `@CrudGenerator` option `paging` to false will result in no paginated response

Only disable if you can guarantee that the data set will stay small enough.
