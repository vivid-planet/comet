import { Selection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/Selection/Selection Component", module).add("Selection Component", () => {
    return (
        <>
            <h2>Selection Component:</h2>
            <Selection>
                {({ selectedId, selectionApi, selectionMode }) => (
                    <div>
                        <p>id: {selectedId}</p>
                        <p>mode: {selectionMode}</p>
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
                                <ListItemText primary="Add New" />
                            </ListItem>
                        </List>
                    </div>
                )}
            </Selection>
        </>
    );
});
