import { Check, ChevronDown } from "@comet/admin-icons";
import { MenuItemProps, Select, SelectProps, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

import { FilterBarSingleSelectClassKey } from "./FilterBarSingleSelect.styles";
import { styles } from "./FilterBarSingleSelect.styles";

export type MenuItemValues = string | ReadonlyArray<string> | number | undefined;

export interface FilterBarSingleSelectProps<FieldValue extends MenuItemValues> extends SelectProps {
    value: FieldValue;
    onChange: (event: React.ChangeEvent<FieldValue> | FieldValue | unknown) => void;
    children: Array<React.ReactElement<MenuItemProps>>;
    hideCheck?: boolean;
}

const SingleSelect = <FieldValue extends MenuItemValues>({
    value,
    onChange,
    hideCheck = false,
    children,
    classes,
    ...props
}: FilterBarSingleSelectProps<FieldValue> & WithStyles<typeof styles>): React.ReactElement => {
    let items = children;

    if (!hideCheck) {
        items = React.Children.map(children, (child: React.ReactElement<MenuItemProps>) => {
            const { children, value: menuItemValue } = child.props;
            return React.cloneElement(child, {
                children: (
                    <>
                        {children}
                        {value === menuItemValue && <Check />}
                    </>
                ),
            });
        });
    }

    return (
        <div className={classes.wrapper}>
            <Select
                className={classes.root}
                IconComponent={ChevronDown}
                MenuProps={{
                    className: classes.menu,
                    PaperProps: { style: { marginTop: 2, marginLeft: -1 } },
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                    },
                    getContentAnchorEl: null,
                }}
                disableUnderline
                displayEmpty
                value={value}
                onChange={onChange}
                {...props}
            >
                {items}
            </Select>
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
        CometAdminFilterBarSingleSelect: FilterBarSingleSelectProps<MenuItemValues>;
    }
}
