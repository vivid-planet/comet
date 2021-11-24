import { ChevronDown } from "@comet/admin-icons";
import { Popover } from "@material-ui/core";
import { MenuItemProps as MuiMenuItemProps } from "@material-ui/core/MenuItem/MenuItem";
import React from "react";
import { FieldRenderProps } from "react-final-form";

import { FinalFormSingleSelect } from "../../../form/FinalFormSingleSelect";
import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";

interface MenuItemProps extends MuiMenuItemProps {
    children?: React.ReactNode | ((selected: boolean) => React.ReactNode);
}
export interface FilterBarSingleSelectProps extends FieldRenderProps<string, HTMLDivElement> {
    label: React.ReactNode;
    filterBarButtonProps?: FilterBarButtonProps;
    children: React.ReactElement<MenuItemProps>[];
    closeAfterClick?: boolean;
}

const SingleSelect = ({ label, filterBarButtonProps, children, closeAfterClick = true, ...props }: FilterBarSingleSelectProps) => {
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
        <div>
            <FilterBarButton openPopover={open} onClick={openPopover} endIcon={<ChevronDown />} {...filterBarButtonProps}>
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
                elevation={2}
                keepMounted
            >
                <div>
                    <FinalFormSingleSelect {...props}>{items}</FinalFormSingleSelect>
                </div>
            </Popover>
        </div>
    );
};

export const FilterBarSingleSelect = SingleSelect;
