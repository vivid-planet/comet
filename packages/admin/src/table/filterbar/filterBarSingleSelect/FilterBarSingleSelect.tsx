import { ChevronDown } from "@comet/admin-icons";
import { Popover, WithStyles } from "@material-ui/core";
import { MenuItemProps as MuiMenuItemProps } from "@material-ui/core/MenuItem/MenuItem";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { FieldRenderProps } from "react-final-form";

import { FinalFormSingleSelect } from "../../../form/FinalFormSingleSelect";
import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";
import { FilterBarSingleSelectClassKey, styles } from "./FilterBarSingleSelect.styles";

interface MenuItemProps extends MuiMenuItemProps {
    children?: React.ReactNode | ((selected: boolean) => React.ReactNode);
}
export interface FilterBarSingleSelectProps extends FieldRenderProps<string, HTMLDivElement> {
    label: React.ReactNode;
    filterBarButtonProps?: FilterBarButtonProps;
    children: React.ReactElement<MenuItemProps>[];
    closeAfterClick?: boolean;
    hideDirtyFieldsBadge?: boolean;
}

const SingleSelect = ({
    label,
    filterBarButtonProps,
    children,
    closeAfterClick = true,
    classes,
    hideDirtyFieldsBadge = true,
    ...props
}: FilterBarSingleSelectProps & WithStyles<typeof styles>) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onClose = () => {
        setAnchorEl(null);
    };

    const items = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
            onClick: (event: React.MouseEvent<HTMLLIElement>) => {
                child.props?.onClick?.(event);
                if (closeAfterClick) {
                    onClose();
                }
            },
        });
    });

    return (
        <div className={classes.root}>
            <FilterBarButton
                numberDirtyFields={props.input.value !== undefined && props.input.value !== null ? 1 : 0}
                hideDirtyFieldsBadge={hideDirtyFieldsBadge}
                openPopover={open}
                onClick={openPopover}
                endIcon={<ChevronDown />}
                {...filterBarButtonProps}
            >
                {label}
            </FilterBarButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                PaperProps={{ square: true, elevation: 1 }}
                classes={{
                    paper: classes.paper,
                }}
                elevation={2}
                keepMounted
            >
                <div className={classes.popoverContentContainer}>
                    <FinalFormSingleSelect {...props}>{items}</FinalFormSingleSelect>
                </div>
            </Popover>
        </div>
    );
};

export const FilterBarSingleSelect = withStyles(styles, { name: "CometAdminFilterBarSingleSelect" })(SingleSelect);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarSingleSelect: FilterBarSingleSelectClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBarSingleSelect: FilterBarSingleSelectProps;
    }
}
