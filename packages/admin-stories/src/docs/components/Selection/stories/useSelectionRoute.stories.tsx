import { useSelectionRoute } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, useLocation } from "react-router";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Selection/useSelectionRoute Hook", module)
    .addDecorator(storyRouterDecorator())
    .add("useSelectionRoute Hook", () => {
        const SelectionList = () => {
            const [SelectionRoute, selection, selectionApi] = useSelectionRoute();

            return (
                <SelectionRoute>
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
                </SelectionRoute>
            );
        };

        const location = useLocation();

        return (
            <Paper style={{ padding: "10px" }}>
                <h2>useSelectionRoute Hook:</h2>
                <p>
                    <strong>Current URL: </strong> {location.pathname}
                </p>
                <Route exact path="/">
                    <Redirect to="/foo" />
                </Route>
                <Route path="/foo">
                    <SelectionList />
                </Route>
            </Paper>
        );
    });
