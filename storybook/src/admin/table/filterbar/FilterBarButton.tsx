import { FilterBarButton } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import { List, ListItem } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

function Story() {
    return (
        <List>
            <ListItem>
                <div>
                    <strong>Resting</strong> <br />
                    <FilterBarButton openPopover={false} endIcon={<ChevronDown />}>
                        Filter Button
                    </FilterBarButton>
                </div>
            </ListItem>
            <ListItem>
                <div>
                    <strong>Disabled</strong> <br />
                    <FilterBarButton openPopover={false} endIcon={<ChevronDown />} disabled>
                        Filter Button
                    </FilterBarButton>
                </div>
            </ListItem>
            <ListItem>
                <div>
                    <strong>Open Dropdown</strong> <br />
                    <FilterBarButton openPopover={true} endIcon={<ChevronDown />}>
                        Filter Button
                    </FilterBarButton>
                </div>
            </ListItem>
            <ListItem>
                <div>
                    <strong>Selected</strong> <br />
                    <FilterBarButton openPopover={false} numberDirtyFields={3} endIcon={<ChevronDown />}>
                        Filter Button
                    </FilterBarButton>
                </div>
            </ListItem>
            <ListItem>
                <div>
                    <strong>Selected Disabled</strong> <br />
                    <FilterBarButton openPopover={false} numberDirtyFields={3} endIcon={<ChevronDown />} disabled>
                        Filter Button
                    </FilterBarButton>
                </div>
            </ListItem>
        </List>
    );
}

storiesOf("@comet/admin/table/filterbar", module).add("Filter Bar Button", () => {
    return <Story />;
});
