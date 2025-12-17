import { AppHeaderDropdown, ClearInputAdornment } from "@comet/admin";
import { Company, Search } from "@comet/admin-icons";
import { findTextMatches, MarkedMatches } from "@comet/cms-admin";
import { Box, Divider, InputAdornment, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

type TenantOption = {
    id: string;
    name: string;
};

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: Array<TenantOption>;
    searchable?: boolean;
    icon?: ReactNode;
}

export function TenantScopeSelect({ value, onChange, options, searchable = true, icon = <Company /> }: Props) {
    const intl = useIntl();
    const theme = useTheme();
    const [searchValue, setSearchValue] = useState<string>("");
    let filteredOptions = options;

    if (searchable) {
        filteredOptions = options.filter((option) => {
            return option.name.toLowerCase().includes(searchValue.toLowerCase());
        });
    }

    const selectedOption = options.find((option) => option.id === value);

    const handleChange = (selectedId: string) => {
        onChange(selectedId);
    };

    return (
        <AppHeaderDropdown
            buttonChildren={selectedOption?.name ?? ""}
            startIcon={icon}
            slotProps={{
                root: {
                    sx: (theme) => ({
                        overflow: "hidden",
                        width: "100%",

                        [theme.breakpoints.up("md")]: {
                            width: "auto",
                        },
                    }),
                },
                button: {
                    slotProps: {
                        root: {
                            sx: (theme) => ({
                                width: "100%",
                                justifyContent: "start",

                                [theme.breakpoints.up("md")]: {
                                    justifyContent: "center",
                                },
                            }),
                        },
                        content: {
                            sx: (theme) => ({
                                width: "100%",
                                justifyContent: "start",

                                [theme.breakpoints.up("md")]: {
                                    justifyContent: "center",
                                },
                            }),
                        },
                        endIcon: {
                            sx: (theme) => ({
                                [theme.breakpoints.up("xs")]: {
                                    "&:not(:first-of-type)": {
                                        marginLeft: "auto",
                                    },
                                },

                                [theme.breakpoints.up("md")]: {
                                    "&:not(:first-of-type)": {
                                        marginLeft: theme.spacing(2),
                                    },
                                },
                            }),
                        },
                        typography: {
                            sx: {
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            },
                        },
                    },
                },
                popover: {
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                    PaperProps: {
                        sx: (theme) => ({
                            minWidth: "350px",
                            maxHeight: "calc(100vh - 60px)",
                            [theme.breakpoints.down("md")]: {
                                width: "100%",
                                maxWidth: "none",
                                bottom: 0,
                            },
                        }),
                    },
                },
            }}
        >
            {(hideDropdown) => (
                <>
                    {searchable && (
                        <>
                            <Box sx={{ px: 3, py: 2 }}>
                                <InputBase
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Search htmlColor={theme.palette.grey[900]} />
                                        </InputAdornment>
                                    }
                                    placeholder={intl.formatMessage({
                                        id: "tenantScopeSelect.searchInput.placeholder",
                                        defaultMessage: "Search...",
                                    })}
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.currentTarget.value)}
                                    endAdornment={
                                        <ClearInputAdornment
                                            onClick={() => setSearchValue("")}
                                            hasClearableContent={searchValue !== ""}
                                            position="end"
                                            slotProps={{
                                                buttonBase: { sx: { fontSize: "16px" } },
                                            }}
                                        />
                                    }
                                    autoFocus
                                    fullWidth
                                />
                            </Box>
                            <Divider />
                        </>
                    )}
                    <List sx={{ paddingTop: 0 }}>
                        {filteredOptions.map((option) => {
                            const isSelected = option.id === value;

                            return (
                                <ListItemButton
                                    key={option.id}
                                    onClick={() => {
                                        hideDropdown();
                                        handleChange(option.id);
                                        setSearchValue("");
                                    }}
                                    selected={isSelected}
                                    sx={({ spacing }) => ({
                                        paddingX: spacing(6),
                                    })}
                                >
                                    <ListItemIcon>
                                        <Company />
                                    </ListItemIcon>
                                    <ListItemText
                                        slotProps={{
                                            primary: {
                                                variant: isSelected ? "subtitle2" : "body2",
                                            },
                                        }}
                                        sx={{ margin: 0 }}
                                        primary={<MarkedMatches text={option.name} matches={findTextMatches(option.name, searchValue)} />}
                                    />
                                </ListItemButton>
                            );
                        })}
                        {filteredOptions.length === 0 && (
                            <ListItem>
                                <FormattedMessage id="tenantScopeSelect.list.noOptions" defaultMessage="No options" />
                            </ListItem>
                        )}
                    </List>
                </>
            )}
        </AppHeaderDropdown>
    );
}
