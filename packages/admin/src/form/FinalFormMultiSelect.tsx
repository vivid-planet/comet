import { createStyles, InputBase, InputBaseProps, MenuItemProps as MuiMenuItemProps, MenuList, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

interface MenuItemProps extends MuiMenuItemProps {
    children?: React.ReactNode | ((selected: boolean) => React.ReactNode);
}
export interface FinalFormMultiSelectProps extends FieldRenderProps<string[], HTMLDivElement> {
    children: React.ReactElement<MenuItemProps>[];
    searchable?: boolean;
    inputProps?: InputBaseProps;
}

function FinalFormMultiSelectComponent({
    input,
    classes,
    children,
    searchable = false,
    inputProps,
}: WithStyles<typeof styles> & FinalFormMultiSelectProps) {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const handleListItemClick = (value: string) => (event: React.SyntheticEvent) => {
        if (input.value !== undefined) {
            if (input.value.includes(value)) {
                if (input.value.filter((item) => item !== value).length === 0) {
                    input.onChange(undefined);
                } else {
                    input.onChange(input.value.filter((item) => item !== value));
                }
            } else {
                if (value) {
                    input.onChange([value, ...input.value]);
                } else {
                    return;
                }
            }
        } else {
            if (value) {
                input.onChange([value]);
            } else {
                return;
            }
        }
    };

    let items = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
            if (child.props.value && typeof child.props.value === "string") {
                const selected = input.value?.includes(child.props.value);
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

    if (searchable) {
        items = items.filter((item) => {
            if (React.isValidElement(item)) {
                if (inputProps?.value && inputProps?.value !== "") {
                    return (item.props.value as string).toLowerCase().includes((inputProps.value as string).toLowerCase());
                } else if (searchValue !== "") {
                    return (item.props.value as string).toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return true;
                }
            }
        });
    }

    return (
        <>
            {searchable && (
                <InputBase
                    value={inputProps?.value ? inputProps?.value : searchValue}
                    onChange={
                        inputProps?.onChange ? inputProps?.onChange : (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
                    }
                    {...inputProps}
                />
            )}
            <MenuList
                classes={{
                    root: classes.root,
                }}
            >
                {items}
            </MenuList>
        </>
    );
}

export type FinalFormMultiSelectClassKey = "root";
const styles = () => {
    return createStyles<FinalFormMultiSelectClassKey, FinalFormMultiSelectProps>({
        root: {},
    });
};

export const FinalFormMultiSelect = withStyles(styles, { name: "CometAdminFinalFormMultiSelect" })(FinalFormMultiSelectComponent);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormMultiSelect: FinalFormMultiSelectClassKey;
    }
}
