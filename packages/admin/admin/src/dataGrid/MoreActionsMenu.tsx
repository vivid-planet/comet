import { MoreVertical } from "@comet/admin-icons";
import { Box, Button, Chip, ChipProps, Divider, DividerProps, Menu, MenuList, MenuListProps, MenuProps, Typography } from "@mui/material";
import * as React from "react";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

export function MoreActionsDivider(props: DividerProps) {
    return <Divider sx={{ margin: "8px 0", borderColor: (theme) => theme.palette.grey[50] }} {...props} />;
}

interface MoreActionsGroupProps {
    groupTitle: React.ReactNode;
    menuListProps?: MenuListProps;
    typographyProps?: React.ComponentProps<typeof Typography>;
}

export function MoreActionsGroup({ groupTitle, children, menuListProps, typographyProps }: PropsWithChildren<MoreActionsGroupProps>) {
    return (
        <>
            <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" mt={4} px={1} {...typographyProps}>
                {groupTitle}
            </Typography>
            <MenuList {...menuListProps}>{children}</MenuList>
        </>
    );
}

interface MoreActionsMenuProps {
    selectionSize?: number;
    buttonProps?: React.ComponentProps<typeof Button>;
    menuProps?: Partial<MenuProps>;
    chipProps?: Partial<ChipProps>;
    children?: (props: { handleClose: () => void }) => React.ReactNode;
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

export function MoreActionsMenu({ children, buttonProps, menuProps, chipProps, selectionSize }: MoreActionsMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="text"
                color="inherit"
                endIcon={<MoreVertical />}
                sx={{ mx: 2 }}
                {...buttonProps}
                onClick={(event) => {
                    handleClick(event);
                    buttonProps?.onClick?.(event);
                }}
            >
                <FormattedMessage id="comet.pages.dam.moreActions" defaultMessage="More actions" />
                {!!selectionSize && selectionSize > 0 && <SelectedItemsChip {...chipProps} label={selectionSize} />}
            </Button>
            <Menu
                keepMounted={false}
                anchorEl={anchorEl}
                {...menuProps}
                open={Boolean(anchorEl)}
                onClose={(event, reason) => {
                    handleClose();
                    menuProps?.onClose?.(event, reason);
                }}
            >
                <Box px={2}>{children?.({ handleClose })}</Box>
            </Menu>
        </>
    );
}
