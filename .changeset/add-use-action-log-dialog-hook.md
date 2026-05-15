---
"@comet/cms-admin": minor
---

Add `useActionLogDialog` hook

A new hook that owns the dialog's open state, view state (grid / show version / compare versions), and the three Apollo queries that drive it. It returns a configured `ActionLogDialog` component (ready to render without props) and an `{ openActionLogDialog, closeActionLogDialog }` API — mirroring the `useEditDialog` pattern.

The hook is **explicit about queries**: the app declares each of the three queries with the library's exported fragments (`actionLogGridFragment`, `actionLogShowVersionFragment`, `actionLogCompareFragment`) and passes them in alongside a small accessor that reads the relevant nodes out of the response. This keeps responses fully typed end-to-end via codegen and leaves room for entity-specific extras (custom variables, additional fields, etc.).

**Usage**

```ts
// manufacturerActionLogQueries.ts
import { gql } from "@apollo/client";
import { actionLogCompareFragment, actionLogGridFragment, actionLogShowVersionFragment } from "@comet/cms-admin";

export const manufacturerActionLogsQuery = gql`
    query ManufacturerActionLogs($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
        manufacturer(id: $id) {
            actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                nodes { ...ActionLogGridFragment }
                totalCount
            }
        }
    }
    ${actionLogGridFragment}
`;

export const manufacturerActionLogShowVersionQuery = gql`
    query ManufacturerActionLogShowVersion($id: ID!, $versionId: ID!) {
        manufacturer(id: $id) {
            actionLog(id: $versionId) { ...ActionLogShowVersionFragment }
        }
    }
    ${actionLogShowVersionFragment}
`;

export const manufacturerActionLogCompareVersionsQuery = gql`
    query ManufacturerActionLogCompareVersions($id: ID!, $beforeId: ID!, $afterId: ID!) {
        manufacturer(id: $id) {
            beforeVersion: actionLog(id: $beforeId) { ...ActionLogCompareFragment }
            afterVersion: actionLog(id: $afterId) { ...ActionLogCompareFragment }
        }
    }
    ${actionLogCompareFragment}
`;
```

```tsx
// ManufacturerEditToolbar.tsx
const [ActionLogDialog, { openActionLogDialog }] = useActionLogDialog<
    GQLManufacturerActionLogsQuery,
    GQLManufacturerActionLogShowVersionQuery,
    GQLManufacturerActionLogCompareVersionsQuery
>({
    id,
    queries: {
        grid: {
            document: manufacturerActionLogsQuery,
            getActionLogs: (data) => data.manufacturer.actionLogs,
        },
        showVersion: {
            document: manufacturerActionLogShowVersionQuery,
            getActionLog: (data) => data.manufacturer.actionLog,
        },
        compareVersions: {
            document: manufacturerActionLogCompareVersionsQuery,
            getActionLogs: (data) => ({
                beforeVersion: data.manufacturer.beforeVersion,
                afterVersion: data.manufacturer.afterVersion,
            }),
        },
    },
});

return (
    <>
        <Button onClick={openActionLogDialog}>Version history</Button>
        <ActionLogDialog />
    </>
);
```

Each query document must declare the variables the hook supplies (`$id, $offset, $limit, $sort` for grid; `$id, $versionId` for show; `$id, $beforeId, $afterId` for compare) and must `...` the corresponding library fragment.
