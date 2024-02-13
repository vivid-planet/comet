import { AppHeader, AppHeaderButton, AppHeaderDropdown, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import { Account, Language, Logout, Preview } from "@comet/admin-icons";
import { Avatar, Box, Button, Divider, MenuItem, MenuList } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/AppHeader/AppHeader", module).add("AppHeader", () => {
    function AccountHeaderItem() {
        return (
            <Box display="flex" alignItems="center">
                <Avatar style={{ marginRight: 10 }}>
                    <Account />
                </Avatar>
                User Name
            </Box>
        );
    }

    return (
        <AppHeader position="relative" headerHeight={60}>
            <AppHeaderMenuButton />
            <CometLogo />

            <AppHeaderFillSpace />

            <AppHeaderButton startIcon={<Preview />}>Preview</AppHeaderButton>

            <AppHeaderDropdown buttonChildren="Language" startIcon={<Language />}>
                {(closeDropdown: () => void) => {
                    const onItemClicked = () => {
                        closeDropdown();
                        // Change language
                    };

                    return (
                        <MenuList>
                            <MenuItem onClick={onItemClicked}>DE</MenuItem>
                            <MenuItem onClick={onItemClicked}>EN</MenuItem>
                            <MenuItem onClick={onItemClicked}>FR</MenuItem>
                            <MenuItem onClick={onItemClicked}>ES</MenuItem>
                        </MenuList>
                    );
                }}
            </AppHeaderDropdown>

            <AppHeaderDropdown buttonChildren={<AccountHeaderItem />}>
                <MenuList>
                    <MenuItem>Edit Profile</MenuItem>
                    <MenuItem>Change Password</MenuItem>
                </MenuList>

                <Divider />

                <Box padding={4}>
                    <Button variant="contained" color="primary" startIcon={<Logout />} fullWidth>
                        Logout
                    </Button>
                </Box>
            </AppHeaderDropdown>
        </AppHeader>
    );
});
