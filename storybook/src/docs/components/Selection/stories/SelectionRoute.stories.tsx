import { SelectionRoute } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, useLocation } from "react-router";

import { storyRouterDecorator } from "../../../../story-router.decorator";

storiesOf("stories/components/Selection/SelectionRoute Component", module)
    .addDecorator(storyRouterDecorator())
    .add("SelectionRoute Component", () => {
        const SelectionList = () => {
            return (
                <SelectionRoute>
                    {({ selectedId, selectionApi, selectionMode }) => {
                        return (
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
                        );
                    }}
                </SelectionRoute>
            );
        };

        const location = useLocation();

        return (
            <Paper style={{ padding: "10px" }}>
                <h2>SelectionRoute Component:</h2>
                <p>
                    <strong>Current URL: </strong> {location.pathname}
                </p>
                <Route exact path="/">
                    <Redirect to="/example" />
                </Route>
                <Route path="/example">
                    <SelectionList />
                </Route>
            </Paper>
        );
    });
