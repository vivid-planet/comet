---
"@comet/admin": minor
---

useDataGridRemote: store sort/filter/paging state additionally to query-param in local state and fall back to it if the query-param is lost

Avoids losing grid state, for instance, when opening an EditDialog that creates its own sub-route.
