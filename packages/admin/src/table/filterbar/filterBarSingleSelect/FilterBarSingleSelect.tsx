import { ChevronDown } from "@comet/admin-icons";
import { Popover } from "@material-ui/core";
import React from "react";
import { Form, useForm } from "react-final-form";

import { FilterBarButton, FilterBarButtonProps } from "../filterBarButton/FilterBarButton";

interface FilterBarChildrenProps {
    onClose: () => void;
}
export interface FilterBarSingleSelectProps {
    children: React.ReactNode | ((props: FilterBarChildrenProps) => React.ReactNode);
    label: React.ReactNode;
    filterBarButtonProps?: FilterBarButtonProps;
}

const SingleSelect = ({ label, filterBarButtonProps, children }: FilterBarSingleSelectProps) => {
    const outerForm = useForm();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div>
            <Form
                onSubmit={(values) => {
                    for (const name in values) {
                        outerForm.change(name, values[name]);
                    }
                }}
                initialValues={outerForm.getState().values}
            >
                {({ form, values, handleSubmit, dirtyFields }) => {
                    const onClose = () => {
                        setAnchorEl(null);
                        handleSubmit();
                    };

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
                                <div>{typeof children === "function" ? children({ onClose }) : children}</div>
                            </Popover>
                        </div>
                    );
                }}
            </Form>
        </div>
    );
};

export const FilterBarSingleSelect = SingleSelect;
