import {
    AppHeader,
    AppHeaderButton,
    AppHeaderDropdown,
    AppHeaderFillSpace,
    AppHeaderMenuButton,
    CometLogo,
    MasterLayout,
    Menu as CometMenu,
    MenuItemRouterLink,
} from "@comet/admin";
import { Account, Dashboard, Language, Logout, Preview } from "@comet/admin-icons";
import { Avatar, Box, Button, Divider, MenuItem, MenuList } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

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

function Menu() {
    return (
        <CometMenu>
            <MenuItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" selected />
        </CometMenu>
    );
}

function MasterHeader() {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            <CometLogo />
            <AppHeaderFillSpace />
            <AppHeaderButton startIcon={<Preview />}>Preview</AppHeaderButton>
            <AppHeaderDropdown buttonChildren="Language" startIcon={<Language />}>
                {(closeDropdown) => {
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
}

export function Story() {
    return (
        <MasterLayout menuComponent={Menu} headerComponent={MasterHeader}>
            <React.Fragment />
        </MasterLayout>
    );
}

storiesOf("@comet/admin/mui", module)
    .addDecorator(storyRouterDecorator())
    .add("App Header", () => <Story />, { layout: "fullscreen" });
