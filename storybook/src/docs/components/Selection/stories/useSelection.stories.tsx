import { useSelection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Selection/useSelection Hook",
};

export const UseSelectionHook = {
    render: () => {
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
                                <ListItem key={id} button onClick={() => selectionApi.handleSelectId(id)}>
                                    <ListItemText primary={`Item ${id}`} />
                                </ListItem>
                            );
                        })}
                        <ListItem button onClick={() => selectionApi.handleAdd()}>
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText primary="Add Item" />
                        </ListItem>
                    </List>
                </div>
            </Paper>
        );
    },

    name: "useSelection Hook",
};
