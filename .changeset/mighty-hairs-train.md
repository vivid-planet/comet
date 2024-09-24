---
"@comet/admin": minor
---

Add a `CrudMoreActionsMenu` component

The component can be used to create a "More actions" menu for a list of items.
It is typically used in a toolbar above a Data Grid.

**Example**

```tsx
<CrudMoreActionsMenu
    selectionSize={selectionSize}
    overallActions={[
        {
            label: "Export to excel",
            onClick: handleExportToExcelClick,
        },
    ]}
    selectiveActions={[
        {
            label: "move",
            onClick: handleMoveClick,
            icon: <Move />,
            divider: true,
        },
        {
            label: "download",
            onClick: handleDownloadClick,
            icon: <Download />,
        },
    ]}
/>
```
