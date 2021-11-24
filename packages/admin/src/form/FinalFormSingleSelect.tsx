import { MenuItemProps as MuiMenuItemProps, MenuList } from "@material-ui/core";
import React, { PropsWithChildren } from "react";
import { FieldRenderProps } from "react-final-form";

interface MenuItemProps extends MuiMenuItemProps {
    children?: React.ReactNode | ((selected: boolean) => React.ReactNode);
}
export interface FinalFormSingleSelectProps extends FieldRenderProps<string, HTMLDivElement> {
    children: React.ReactElement<MenuItemProps>[];
}

const SingleSelect = ({ input, children }: PropsWithChildren<FinalFormSingleSelectProps>) => {
    const handleListItemClick = (value: string) => () => {
        input.onChange(value);
    };

    const items = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            if (child.props.value && typeof child.props.value === "string") {
                const selected = input.value === child.props.value;
                const children = typeof child.props.children === "function" ? child.props.children(selected) : child.props.children;

                return React.cloneElement(child, {
                    onClick: handleListItemClick(child.props.value),
                    selected,
                    children,
                });
            } else {
                console.error(`child #${index + 1} is missing a value prop`);
            }
        } else {
            console.error(`child #${index + 1} is not a valid ReactElement`);
        }
    });

    return <MenuList>{items}</MenuList>;
};

export const FinalFormSingleSelect = SingleSelect;
