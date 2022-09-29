import { RowActions, Table } from "@comet/admin";
import {
    Account,
    Archive,
    ChevronRight,
    Copy,
    Cut,
    Delete,
    DeviceResponsive,
    Domain,
    Edit,
    FavoriteAdd,
    LinkExternal,
    Master,
    MasterUnlock,
    ThreeDotSaving,
    Wrench,
} from "@comet/admin-icons";
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper, SxProps, Theme, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../story-router.decorator";

storiesOf("stories/components/Row Actions", module)
    .addDecorator(storyRouterDecorator())
    .add("Example in Table", () => {
        const [isDeleting, setIsDeleting] = React.useState(false);

        const data = [
            { id: 1, firstname: "Kady", lastname: "Wood", job: "Project Manager" },
            { id: 2, firstname: "Lewis", lastname: "Chan", job: "UI/UX Designer" },
            { id: 3, firstname: "Tom", lastname: "Weaver", job: "Frontend Developer" },
            { id: 4, firstname: "Mia", lastname: "Carroll", job: "Backend Developer" },
        ];

        return (
            <>
                <Table
                    data={data}
                    totalCount={data.length}
                    columns={[
                        {
                            name: "id",
                            header: "ID",
                        },
                        {
                            name: "name",
                            header: "Name",
                            render: (row) => `${row.firstname} ${row.lastname}`,
                        },
                        {
                            name: "job",
                            header: "Job",
                        },
                        {
                            name: "actions",
                            render: ({ firstname }) => {
                                return (
                                    <RowActions
                                        iconActions={[
                                            {
                                                icon: <Edit />,
                                                color: "primary",
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                            {
                                                icon: <FavoriteAdd />,
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                        ]}
                                        menuActions={[
                                            {
                                                text: "Promote",
                                                icon: <Master />,
                                                onClick: (event, closeMenu) => {
                                                    // Do something
                                                    closeMenu();
                                                },
                                            },
                                            {
                                                text: "Demote",
                                                icon: <MasterUnlock />,
                                                onClick: (event, closeMenu) => {
                                                    // Do something
                                                    closeMenu();
                                                },
                                            },
                                            <Divider key="menuDivider" />,
                                            {
                                                text: isDeleting ? "Deleting..." : "Delete",
                                                icon: isDeleting ? <ThreeDotSaving /> : <Delete />,
                                                disabled: isDeleting,
                                                onClick: (event, closeMenu) => {
                                                    setIsDeleting(true);
                                                    // Pretending to do something...
                                                    setTimeout(() => {
                                                        closeMenu();
                                                        setIsDeleting(false);
                                                    }, 2000);
                                                },
                                            },
                                        ]}
                                    />
                                );
                            },
                        },
                    ]}
                />
            </>
        );
    })
    .add("Icons with space & hover styles", () => {
        const iconButtonStyles: SxProps<Theme> = ({ palette }) => ({ ":hover": { color: palette.primary.main } });

        return (
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2 }}>
                <Typography>Icons with space & hover styles</Typography>
                <RowActions
                    iconActions={[
                        { icon: <Copy />, sx: iconButtonStyles },
                        { icon: <Cut />, sx: iconButtonStyles },
                        <Box key="iconSpacerOne" sx={{ width: 15 }} />,
                        { icon: <Archive />, sx: iconButtonStyles },
                        { icon: <Delete />, sx: ({ palette }) => ({ ":hover": { color: palette.error.main } }) },
                        <Box key="iconSpacerTwo" sx={{ width: 15 }} />,
                    ]}
                    menuActions={[
                        {
                            text: "Do something",
                            icon: <LinkExternal />,
                            onClick(_, closeMenu) {
                                closeMenu();
                            },
                        },
                    ]}
                />
            </Paper>
        );
    })
    .add("Render custom menu items", () => {
        type SettingsMenuItemProps = {
            closeMenu: () => void;
        };

        const SettingsMenuItem = ({ closeMenu }: SettingsMenuItemProps) => {
            const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);
            const settingsMenuItemRef = React.useRef(null);

            return (
                <>
                    <MenuItem ref={settingsMenuItemRef} onClick={() => setShowSettingsMenu(true)}>
                        <ListItemIcon>
                            <Wrench />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        <ChevronRight color="action" />
                    </MenuItem>
                    <Menu
                        anchorEl={settingsMenuItemRef.current}
                        open={showSettingsMenu}
                        onClose={() => setShowSettingsMenu(false)}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        <MenuItem
                            onClick={() => {
                                setShowSettingsMenu(false);
                                closeMenu();
                            }}
                        >
                            <ListItemIcon>
                                <Account />
                            </ListItemIcon>
                            <ListItemText primary="Account Settings" />
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setShowSettingsMenu(false);
                                closeMenu();
                            }}
                        >
                            <ListItemIcon>
                                <DeviceResponsive />
                            </ListItemIcon>
                            <ListItemText primary="Device Settings" />
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setShowSettingsMenu(false);
                                closeMenu();
                            }}
                        >
                            <ListItemIcon>
                                <Domain />
                            </ListItemIcon>
                            <ListItemText primary="Global Settings" />
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setShowSettingsMenu(false);
                                closeMenu();
                            }}
                        >
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <ListItemText primary="Delete everything" />
                        </MenuItem>
                    </Menu>
                </>
            );
        };

        return (
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 2 }}>
                <Typography>Manually render more complex items, like sub-menus</Typography>
                <RowActions
                    componentsProps={{ menu: { PaperProps: { sx: { minWidth: 220 } } } }}
                    menuActions={[
                        {
                            text: "Do something",
                            icon: <LinkExternal />,
                            onClick(_, closeMenu) {
                                closeMenu();
                            },
                        },
                        (closeMenu) => <SettingsMenuItem key="settingsMenu" closeMenu={closeMenu} />,
                    ]}
                />
            </Paper>
        );
    });
