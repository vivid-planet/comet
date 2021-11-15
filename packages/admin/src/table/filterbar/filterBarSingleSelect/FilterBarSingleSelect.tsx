import { Check, ChevronDown } from "@comet/admin-icons";
import { List, ListItem, Popover } from "@material-ui/core";
import isEqual from "lodash.isequal";
import React from "react";

import { FinalFormInputProps } from "../../../form/FinalFormInput";
import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";

export interface FilterBarSingleSelectItem<Item> {
    key: string;
    label: React.ReactNode;
    payload: Item;
}

export interface FilterBarSingleSelectProps<Item> extends FinalFormInputProps {
    items: FilterBarSingleSelectItem<Item>[];
    buttonLabel: React.ReactNode;
    filterBarButtonProps?: FilterBarButtonProps;
}

const SingleSelect = <Item,>({ buttonLabel, filterBarButtonProps, input, items }: FilterBarSingleSelectProps<Item>) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <FilterBarButton openPopover={open} onClick={openPopover} endIcon={<ChevronDown />} {...filterBarButtonProps}>
                {buttonLabel}
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
                    <List>
                        {items.map((item) => {
                            const selected = isEqual(item.payload, input.value);
                            return (
                                <ListItem
                                    key={item.key}
                                    onClick={() => {
                                        input.onChange(item.payload);
                                        onClose();
                                    }}
                                    selected={selected}
                                >
                                    {item.label}
                                    {selected && <Check />}
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            </Popover>
        </div>
    );
};

export const FilterBarSingleSelect = SingleSelect;
