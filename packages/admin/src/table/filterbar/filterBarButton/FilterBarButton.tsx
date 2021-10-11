import { Button, Typography, WithStyles, withStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import clsx from "clsx";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { FilterBarButtonClassKey, styles } from "./FilterBarButton.styles";

export interface FilterBarButtonProps extends ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    countValue?: number;
    openPopover: boolean;
}

const FilterBarButton = ({
    children,
    dirtyFieldsBadge,
    countValue,
    openPopover,
    startIcon,
    endIcon,
    classes,
    ...buttonProps
}: FilterBarButtonProps & WithStyles<typeof styles>): React.ReactElement => {
    const selected = !!(countValue && countValue > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;

    return (
        <Button className={clsx(classes.root, selected && classes.selected, openPopover && classes.open)} disableRipple {...buttonProps}>
            {startIcon && <span className={classes.startIcon}>{startIcon}</span>}
            <div className={clsx(classes.labelWrapper, selected && classes.labelWrapperWithValues)}>
                <Typography variant="body1">{children}</Typography>
            </div>
            {selected && (
                <span className={classes.filterBadge}>
                    <FilterBarActiveFilterBadgeComponent countValue={countValue as number} />
                </span>
            )}
            {endIcon && <span className={selected ? classes.endIconWithFilterBadge : classes.endIcon}>{endIcon}</span>}
        </Button>
    );
};

const FilterBarButtonWithStyles = withStyles(styles, { name: "CometAdminFilterBarButton" })(FilterBarButton);

export { FilterBarButtonWithStyles as FilterBarButton };

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminMyComponent: FilterBarButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminMyComponent: FilterBarButtonProps;
    }
}
