import { MoreVertical } from "@comet/admin-icons";
import {
    Button,
    Chip,
    ChipProps,
    Divider,
    DividerProps,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    MenuListProps,
    Typography,
} from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import * as React from "react";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

function CrudMoreActionsDivider(props: DividerProps) {
    return <Divider sx={{ margin: "8px 10px", borderColor: (theme) => theme.palette.grey[50] }} {...props} />;
}

interface CrudMoreActionsGroupProps {
    groupTitle: React.ReactNode;
    menuListProps?: MenuListProps;
    typographyProps?: React.ComponentProps<typeof Typography>;
}

function CrudMoreActionsGroup({ groupTitle, children, menuListProps, typographyProps }: PropsWithChildren<CrudMoreActionsGroupProps>) {
    return (
        <>
            <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" pt="20px" px="15px" {...typographyProps}>
                {groupTitle}
            </Typography>
            <MenuList {...menuListProps}>{children}</MenuList>
        </>
    );
}

export interface ActionItem extends React.ComponentProps<typeof MenuItem> {
    type: "action";
    label: React.ReactNode;
    icon?: React.ReactNode;
}

export interface DividerItem extends React.ComponentProps<typeof Divider> {
    type: "divider";
}

type CrudMoreActionsItem = ActionItem | DividerItem;

export interface CrudMoreActionsMenuProps {
    selectionSize?: number;
    overallItems?: Maybe<CrudMoreActionsItem>[];
    selectiveItems?: Maybe<CrudMoreActionsItem>[];
}

function SelectedItemsChip({ label, ...restProps }: Partial<ChipProps>) {
    return (
        <Chip
            size="small"
            color="primary"
            sx={{ width: 20, height: 20, flexShrink: 0, borderRadius: 20, marginLeft: 1 }}
            {...restProps}
            label={label}
        />
    );
}

export function CrudMoreActionsMenu({ overallItems, selectiveItems, selectionSize }: CrudMoreActionsMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Button variant="text" color="inherit" endIcon={<MoreVertical />} sx={{ mx: 2 }} onClick={handleClick}>
                <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                {!!selectionSize && <SelectedItemsChip label={selectionSize} />}
            </Button>
            <Menu
                keepMounted={false}
                PaperProps={{ sx: { minWidth: 220, borderRadius: "4px" } }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                {!!overallItems?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.overallActions" defaultMessage="Overall actions" />}
                    >
                        {overallItems.map((item, index) => {
                            if (!item) return null;
                            const { type } = item;
                            if (type === "action") {
                                const { label, icon, onClick, ...rest } = item;

                                return (
                                    <MenuItem
                                        key={index}
                                        disabled={!!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                    </MenuItem>
                                );
                            } else if (type === "divider") {
                                return <CrudMoreActionsDivider {...item} key={index} />;
                            }
                        })}
                    </CrudMoreActionsGroup>
                )}

                {!!overallItems?.length && !!selectiveItems?.length && <CrudMoreActionsDivider />}

                {!!selectiveItems?.length && (
                    <CrudMoreActionsGroup
                        groupTitle={<FormattedMessage id="comet.dam.moreActions.selectiveActions" defaultMessage="Selective actions" />}
                    >
                        {selectiveItems.map((item, index) => {
                            if (!item) return;

                            const { type } = item;
                            if (type === "action") {
                                const { label, icon, onClick, ...rest } = item;

                                return (
                                    <MenuItem
                                        key={index}
                                        disabled={!selectionSize}
                                        {...rest}
                                        onClick={(e) => {
                                            onClick?.(e);
                                            handleClose();
                                        }}
                                    >
                                        {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
                                        <ListItemText primary={label} />
                                        {!!selectionSize && <SelectedItemsChip label={selectionSize} />}
                                    </MenuItem>
                                );
                            } else if (item.type === "divider") {
                                return <CrudMoreActionsDivider {...item} key={index} />;
                            }
                        })}
                    </CrudMoreActionsGroup>
                )}
            </Menu>
        </>
    );
}
