---
"@comet/cms-api": minor
---

Adjust `searchToMikroOrmQuery` function to reduce the amount of irrelevant results

This is done by using a combination of AND- and OR-queries. For example, a search of `red shirt` won't give all products containing `red` OR `shirt` but rather returns all products that have the words `red` AND `shirt` in some column. The words don't have to be in the same column.
