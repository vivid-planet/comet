import { Selection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import * as React from "react";

export default {
    title: "stories/components/Selection/Selection Component",
};

export const SelectionComponent = () => {
    return (
        <Paper style={{ padding: "10px" }}>
            <h2>Selection Component:</h2>
            <Selection>
                {({ selectedId, selectionApi, selectionMode }) => (
                    <div>
                        <p>selectedId: {selectedId}</p>
                        <p>selectionMode: {selectionMode}</p>
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
                )}
            </Selection>
        </Paper>
    );
};
