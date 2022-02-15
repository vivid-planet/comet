import { AppHeader, AppHeaderDropdown, AppHeaderFillSpace } from "@comet/admin";
import { Snips } from "@comet/admin-icons";
import { Box, MenuItem, MenuList, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/Dropdown", module).add("AppHeader Dropdown", () => {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <>
            <div style={{ marginBottom: "30px" }}>Dropdown Menu state: {open ? "open" : "closed"}</div>
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header dropdown</Typography>
                <AppHeaderFillSpace />

                <AppHeaderDropdown buttonChildren={<Snips />} dropdownArrow={null}>
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

                <AppHeaderDropdown buttonChildren="Dropdown Menu" open={open} onOpenChange={setOpen}>
                    {() => {
                        return (
                            <MenuList>
                                <MenuItem>Item 1</MenuItem>
                                <MenuItem>Item 2</MenuItem>
                                <MenuItem>Item 3</MenuItem>
                            </MenuList>
                        );
                    }}
                </AppHeaderDropdown>
            </AppHeader>
        </>
    );
});
