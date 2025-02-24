import {
    AppHeader,
    AppHeaderButton,
    AppHeaderDropdown,
    AppHeaderMenuButton,
    Button,
    CometLogo,
    FillSpace,
    MainContent,
    MainNavigation,
    MainNavigationItemRouterLink,
    MasterLayout,
} from "@comet/admin";
import { Account, Dashboard, Language, Logout, Preview } from "@comet/admin-icons";
import { Avatar, Box, Divider, MenuItem, MenuList } from "@mui/material";

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
        <MainNavigation>
            <MainNavigationItemRouterLink primary="Dashboard" icon={<Dashboard />} to="/dashboard" selected />
        </MainNavigation>
    );
}

function MasterHeader() {
    return (
        <AppHeader>
            <AppHeaderMenuButton />
            <CometLogo />
            <FillSpace />
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
                    <Button startIcon={<Logout />} fullWidth>
                        Logout
                    </Button>
                </Box>
            </AppHeaderDropdown>
        </AppHeader>
    );
}

export default {
    title: "@comet/admin/mui",
    decorators: [storyRouterDecorator()],
    excludeStories: ["Story"],
};

export const _AppHeader = {
    render: () => {
        return (
            <MasterLayout menuComponent={Menu} headerComponent={MasterHeader}>
                <MainContent>Some content</MainContent>
            </MasterLayout>
        );
    },

    parameters: { layout: "fullscreen" },
};
