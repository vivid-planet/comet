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
    Save,
    ThreeDotSaving,
    Wrench,
} from "@comet/admin-icons";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    SxProps,
    Theme,
    Tooltip,
    Typography,
} from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../../story-router.decorator";

type MenuItem = {
    text: string;
    icon: React.ElementType;
};

const menuItems: MenuItem[] = [
    {
        text: "Account Settings",
        icon: Account,
    },
    {
        text: "Device Settings",
        icon: DeviceResponsive,
    },
    {
        text: "Global Settings",
        icon: Domain,
    },
];

storiesOf("stories/components/RowActions", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator((Story) => (
        <Paper
            variant="outlined"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: 2,
                maxWidth: 320,
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <Story />
        </Paper>
    ))
    .add("IconActions with props object", () => (
        <RowActions
            iconActions={[
                {
                    icon: <Edit />,
                    color: "primary",
                    tooltip: "Edit",
                    onClick: () => {
                        // Do something
                    },
                },
                {
                    icon: <FavoriteAdd />,
                    tooltip: "Add to favorites",
                    onClick: () => {
                        // Do something
                    },
                },
            ]}
        />
    ))
    .add("IconActions with react node", () => {
        const SaveButton = () => {
            const [loading, setLoading] = React.useState(false);

            return (
                <Tooltip title="Save">
                    {loading ? (
                        <CircularProgress size={16} sx={{ padding: "8px" }} />
                    ) : (
                        <IconButton
                            onClick={() => {
                                setLoading(true);
                                // Pretending to do something...
                                setTimeout(() => {
                                    setLoading(false);
                                }, 2000);
                            }}
                        >
                            <Save />
                        </IconButton>
                    )}
                </Tooltip>
            );
        };

        return (
            <RowActions
                iconActions={[
                    {
                        icon: <Edit />,
                        tooltip: "Edit",
                        color: "primary",
                        onClick: () => {
                            // Do something
                        },
                    },
                    <SaveButton key="save" />,
                ]}
            />
        );
    })
    .add("MenuActions with props object", () => (
        <RowActions
            menuActions={[
                {
                    text: "Edit item",
                    icon: <Edit />,
                    onClick: () => {
                        // Do something
                    },
                },
                {
                    text: "Add to favourites",
                    icon: <FavoriteAdd />,
                    onClick: () => {
                        // Do something
                    },
                },
            ]}
        />
    ))
    .add("MenuActions with react node", () => {
        type SettingsMenuItemProps = {
            closeRowActionsMenu: () => void;
        };

        const SettingsMenuItem = ({ closeRowActionsMenu }: SettingsMenuItemProps) => {
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
                        onClose={() => {
                            setShowSettingsMenu(false);
                            closeRowActionsMenu();
                        }}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        {menuItems.map(({ text, icon: Icon }, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    // Do something
                                    setShowSettingsMenu(false);
                                    closeRowActionsMenu();
                                }}
                            >
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            );
        };

        return (
            <RowActions
                menuActions={[
                    {
                        text: "Edit item",
                        icon: <Edit />,
                        onClick: () => {
                            // Do something
                        },
                    },
                    {
                        text: "Add to favourites",
                        icon: <FavoriteAdd />,
                        onClick: () => {
                            // Do something
                        },
                    },
                    <Divider key="first-divider" />,
                    (closeMenu) => <SettingsMenuItem key="settingsMenu" closeRowActionsMenu={closeMenu} />,
                ]}
            />
        );
    })

    .add("MenuActions with props object custom closing", () => {
        const [isDeleting, setIsDeleting] = React.useState(false);

        return (
            <RowActions
                menuActions={[
                    {
                        text: isDeleting ? "Deleting..." : "Delete",
                        icon: isDeleting ? <ThreeDotSaving /> : <Delete />,
                        disabled: isDeleting,
                        preventCloseOnClick: true,
                        onClick: (event, closeMenu) => {
                            setIsDeleting(true);
                            // Pretending to do something...
                            setTimeout(() => {
                                closeMenu();
                                setIsDeleting(false);
                            }, 2000);
                        },
                    },
                    (closeMenu) => (
                        <MenuItem
                            key="archive"
                            onClick={() => {
                                // Do something
                                closeMenu();
                            }}
                        >
                            <ListItemIcon>
                                <Archive />
                            </ListItemIcon>
                            <ListItemText primary="Archive" />
                        </MenuItem>
                    ),
                ]}
            />
        );
    });

storiesOf("stories/components/RowActions", module)
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
                            render: () => {
                                return (
                                    <RowActions
                                        iconActions={[
                                            {
                                                icon: <Edit />,
                                                tooltip: "Edit",
                                                color: "primary",
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                            {
                                                icon: <FavoriteAdd />,
                                                tooltip: "Add to favorites",
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                        ]}
                                        menuActions={[
                                            {
                                                text: "Promote",
                                                icon: <Master />,
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                            {
                                                text: "Demote",
                                                icon: <MasterUnlock />,
                                                onClick: () => {
                                                    // Do something
                                                },
                                            },
                                            <Divider key="menuDivider" />,
                                            {
                                                text: isDeleting ? "Deleting..." : "Delete",
                                                icon: isDeleting ? <ThreeDotSaving /> : <Delete />,
                                                disabled: isDeleting,
                                                preventCloseOnClick: true,
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
                        { icon: <Copy />, tooltip: "Copy", sx: iconButtonStyles },
                        { icon: <Cut />, tooltip: "Cut", sx: iconButtonStyles },
                        <Box key="iconSpacerOne" sx={{ width: 15 }} />,
                        { icon: <Archive />, tooltip: "Archive", sx: iconButtonStyles },
                        { icon: <Delete />, tooltip: "Delete", sx: ({ palette }) => ({ ":hover": { color: palette.error.main } }) },
                        <Box key="iconSpacerTwo" sx={{ width: 15 }} />,
                    ]}
                    menuActions={[
                        {
                            text: "Do something",
                            icon: <LinkExternal />,
                            onClick() {
                                // Do something
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
                        onClose={() => {
                            setShowSettingsMenu(false);
                            closeMenu();
                        }}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        {menuItems.map(({ text, icon: Icon }, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    // Do something
                                    setShowSettingsMenu(false);
                                    closeMenu();
                                }}
                            >
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </MenuItem>
                        ))}
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
                            onClick() {
                                // Do something
                            },
                        },
                        (closeMenu) => <SettingsMenuItem key="settingsMenu" closeMenu={closeMenu} />,
                    ]}
                />
            </Paper>
        );
    });
