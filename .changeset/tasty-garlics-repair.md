---
"@comet/cms-api": minor
---

Change searchToMikroOrmQuery function of mikro-orm to a combination of an and- & or-query

This is done to make it more restrictive and reduce the number of redundant results. For example a search of `red shirt` won't give all products containing `red` OR `shirt` but rather returns all products that have the words `red` AND `shirt` in some column. The words don't have to be in the same column.
