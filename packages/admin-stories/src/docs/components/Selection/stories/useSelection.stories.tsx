import { useSelection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Selection/useSelection Hook", module).add("useSelection Hook", () => {
    const [selection, selectionApi] = useSelection();

    return (
        <Paper style={{ padding: "10px" }}>
            <h2>useSelection Hook:</h2>
            <div>
                <p>selectedId: {selection.id}</p>
                <p>selectionMode: {selection.mode}</p>
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
});
