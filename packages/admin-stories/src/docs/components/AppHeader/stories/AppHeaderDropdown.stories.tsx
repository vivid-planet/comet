import { AppHeader, AppHeaderDropdown, AppHeaderFillSpace } from "@comet/admin";
import { Snips } from "@comet/admin-icons";
import { Box, MenuItem, MenuList, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Dropdown", module).add("AppHeader Dropdown", () => {
    return (
        <AppHeader position="relative" headerHeight={60}>
            <Typography style={{ padding: 20 }}>Header dropdown</Typography>
            <AppHeaderFillSpace />

            <AppHeaderDropdown actionContent={<Snips />} dropdownArrow={null}>
                <Box padding={4} width={200}>
                    <Typography>
                        <strong>Dropdown Text</strong>
                        <br />
                        <br />
                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat
                        porttitor ligula, eget lacinia odio sem nec elit.
                    </Typography>
                </Box>
            </AppHeaderDropdown>

            <AppHeaderDropdown actionContent="Dropdown Menu">
                {() => {
                    return (
                        <MenuList>
                            <MenuItem button>Item 1</MenuItem>
                            <MenuItem button>Item 2</MenuItem>
                            <MenuItem button>Item 3</MenuItem>
                        </MenuList>
                    );
                }}
            </AppHeaderDropdown>
        </AppHeader>
    );
});
