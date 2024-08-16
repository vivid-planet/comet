---
"@comet/admin": minor
---

Add a crud more actions menu helper component

This is done to provide a simple api to create a more actions menu for a list of items.

**Example:**

```tsx
<CrudMoreActionsMenu
    selectionSize={selectionSize}
    overAllItems={[
        {
            label: "Export to excel",
            onClick: handleExportToExcelClick,
        },
    ]}
    selectiveItems={[
        {
            label: "move",
            onClick: handleMoveClick,
            startAdornment: <Move />,
            divider: true,
        },
        {
            label: "download",
            onClick: handleDownloadClick,
            startAdornment: <Download />,
        },
    ]}
/>
```
