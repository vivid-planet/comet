---
"@comet/admin": minor
---

useDataGridRemote: store sort/filter/paging state additionally to query-param in local state and fall back to it if the query-param is lost

Avoids losing grid state when eg. EditDialog that creates it's own sub-route is opened
