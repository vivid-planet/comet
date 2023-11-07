import { ChevronDown } from "@comet/admin-icons";
import { Button, ComponentsOverrides, Theme } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { WithStyles } from "@mui/styles";
import withStyles from "@mui/styles/withStyles";
import clsx from "clsx";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { FilterBarButtonClassKey, styles } from "./FilterBarButton.styles";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface FilterBarButtonProps extends ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    numberDirtyFields?: number;
    openPopover?: boolean;
}

const FilterBarButton = ({
    children,
    dirtyFieldsBadge,
    numberDirtyFields,
    openPopover,
    classes,
    endIcon = <ChevronDown />,
    className,
    ...buttonProps
}: FilterBarButtonProps & WithStyles<typeof styles>): React.ReactElement => {
    const hasDirtyFields = !!(numberDirtyFields && numberDirtyFields > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;

    return (
        <Button
            className={clsx(className, classes.root, hasDirtyFields && classes.hasDirtyFields, openPopover && classes.open)}
            disableRipple
            endIcon={endIcon}
            variant="outlined"
            {...buttonProps}
        >
            {children}
            {hasDirtyFields && (
                <span className={classes.filterBadge}>
                    <FilterBarActiveFilterBadgeComponent countValue={numberDirtyFields} />
                </span>
            )}
        </Button>
    );
};

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
const FilterBarButtonWithStyles = withStyles(styles, { name: "CometAdminFilterBarButton" })(FilterBarButton);

export { FilterBarButtonWithStyles as FilterBarButton };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarButton: FilterBarButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarButton: Partial<FilterBarButtonProps>;
    }

    interface Components {
        CometAdminFilterBarButton?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarButton"];
        };
    }
}
