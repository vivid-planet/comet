import { Button, WithStyles, withStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import clsx from "clsx";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { FilterBarButtonClassKey, styles } from "./FilterBarButton.styles";

export interface FilterBarButtonProps extends ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    numberDirtyFields?: number;
    openPopover: boolean;
}

const FilterBarButton = ({
    children,
    dirtyFieldsBadge,
    numberDirtyFields,
    openPopover,
    classes,
    ...buttonProps
}: FilterBarButtonProps & WithStyles<typeof styles>): React.ReactElement => {
    const hasDirtyFields = !!(numberDirtyFields && numberDirtyFields > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;

    return (
        <Button
            className={clsx(classes.root, hasDirtyFields && classes.hasDirtyFields, openPopover && classes.open)}
            disableRipple
            variant="outlined"
            {...buttonProps}
        >
            {children}
            {hasDirtyFields && (
                <span className={classes.filterBadge}>
                    <FilterBarActiveFilterBadgeComponent countValue={numberDirtyFields as number} />
                </span>
            )}
        </Button>
    );
};

const FilterBarButtonWithStyles = withStyles(styles, { name: "CometAdminFilterBarButton" })(FilterBarButton);

export { FilterBarButtonWithStyles as FilterBarButton };

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarButton: FilterBarButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBarButton: FilterBarButtonProps;
    }
}
