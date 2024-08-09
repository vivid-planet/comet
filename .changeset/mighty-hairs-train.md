---
"@comet/admin": minor
---

Add a crud more actions menu helper component

This is done to provide a simple api to create a more actions menu for a list of items.

**Example:**

```tsx
<MoreActionsMenu
    selectionSize={selectionSize}
    overAllItems={[
        {
            type: "action",
            label: "Export to excel",
            onClick: () => {
                handleExportToExcelClick();
                handleClose();
            },
        },
    ]}
    selectiveItems={[
        {
            type: "action",
            label: "move",
            onClick: () => {
                handleMoveClick();
                handleClose();
            },
            startAdornment: <Move />,
        },
        {
            type: "divider",
        },
        {
            type: "action",
            label: "download",
            onClick: () => {
                handleDownloadClick();
                handleClose();
            },
            startAdornment: <Download />,
        },
    ]}
/>
```
