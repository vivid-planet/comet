import { useSelection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Selection/useSelection Hook", module).add("useSelection Hook", () => {
    const [selection, selectionApi] = useSelection();

    return (
        <Paper style={{ padding: "10px" }}>
            <h2>useSelection Hook:</h2>
            <div>
                <p>id: {selection.id}</p>
                <p>mode: {selection.mode}</p>
                <List>
                    {["1", "2", "3"].map((id) => {
                        return (
                            <ListItemButton key={id} onClick={() => selectionApi.handleSelectId(id)}>
                                <ListItemText primary={`Item ${id}`} />
                            </ListItemButton>
                        );
                    })}
                    <ListItemButton onClick={() => selectionApi.handleAdd()}>
                        <ListItemIcon>
                            <Add />
                        </ListItemIcon>
                        <ListItemText primary="Add Item" />
                    </ListItemButton>
                </List>
            </div>
        </Paper>
    );
});
