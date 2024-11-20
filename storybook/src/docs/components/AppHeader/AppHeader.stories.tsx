import { AppHeader, AppHeaderButton, AppHeaderDropdown, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import { Account, Language, Logout, Preview, Snips, SwitchUser, Wrench } from "@comet/admin-icons";
import { Avatar, Box, Button, Divider, MenuItem, MenuList, Typography } from "@mui/material";
import * as React from "react";

export default {
    title: "Docs/Components/AppHeader",
};

export const Basic = {
    render: () => {
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
    },
    name: "AppHeader",
};

export const Empty = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                {/* AppHeader content should be here */}
            </AppHeader>
        );
    },
    name: "AppHeader Empty",
};

export const MenuButton = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <AppHeaderMenuButton />
            </AppHeader>
        );
    },
    name: "AppHeader MenuButton",
};

export const FillSpace = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Left Content</Typography>

                <AppHeaderFillSpace />

                <Typography style={{ padding: 20 }}>Right Content</Typography>
            </AppHeader>
        );
    },
    name: "AppHeader FillSpace",
};

export const ButtonText = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header button</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton>My Button</AppHeaderButton>
            </AppHeader>
        );
    },
    name: "AppHeader Button text",
};

export const ButtonTextAndIcon = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header buttons with icon</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton startIcon={<Wrench />}>My Button</AppHeaderButton>

                <AppHeaderButton endIcon={<Wrench />}>My Button</AppHeaderButton>
            </AppHeader>
        );
    },
    name: "AppHeader Button text and icon",
};

export const ButtonIcon = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header buttons with icon only</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton>
                    <SwitchUser />
                </AppHeaderButton>

                <AppHeaderButton>
                    <Wrench color="primary" />
                </AppHeaderButton>
            </AppHeader>
        );
    },
    name: "AppHeader Button icon",
};

export const CustomButton = {
    render: () => {
        return (
            <AppHeader position="relative" headerHeight={60}>
                <Typography style={{ padding: 20 }}>Header button custom content</Typography>
                <AppHeaderFillSpace />

                <AppHeaderButton>
                    <Box display="flex" alignItems="center">
                        <Avatar style={{ marginRight: 10 }}>
                            <Account />
                        </Avatar>
                        User Name
                    </Box>
                </AppHeaderButton>
            </AppHeader>
        );
    },
    name: "AppHeader Button custom",
};

export const Dropdown = {
    render: () => {
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
    },
    name: "AppHeader Dropdown",
};
