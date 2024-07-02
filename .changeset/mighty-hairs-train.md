---
"@comet/admin": minor
---

Add a more actions menu helper component

This is done to provide a simple api to create a more actions menu for a list of items. 

**Example:**

```tsx
<MoreActionsMenu
    selectionSize={selectionSize}
>
    {({ handleClose }) => (
        <>
            <MenuItem
                onClick={() => {
                    handleMoveClick();
                    handleClose();
                }}
            >
                <ListItemIcon>
                    <Move />
                </ListItemIcon>
                <ListItemText primary={"Move"} />
            </MenuItem>

            <MoreActionsDivider />
            
            <MoreActionsGroup
                groupTitle={"Some Group Title"}
            >
                <MenuItem
                    onClick={() => {
                        handleUploadClick();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <Upload />
                    </ListItemIcon>
                    <ListItemText primary={"Upload"} />
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleDownloadClick();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <Download />
                    </ListItemIcon>
                    <ListItemText primary={"Download"} />
                </MenuItem>
            </MoreActionsGroup>
        </>
    )}
</MoreActionsMenu>
```
