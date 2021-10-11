import { Button, Typography } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import clsx from "clsx";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { useStyles } from "./FilterBarButton.styles";

interface FilterBarButtonProps extends ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    countValue?: number;
    openPopover: boolean;
}

export const FilterBarButton = ({
    children,
    dirtyFieldsBadge,
    countValue,
    openPopover,
    startIcon,
    endIcon,
    ...buttonProps
}: FilterBarButtonProps): React.ReactElement => {
    const selected = !!(countValue && countValue > 0);
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;
    const classes = useStyles();

    return (
        <Button className={clsx(classes.button, selected && classes.selected, openPopover && classes.open)} disableRipple {...buttonProps}>
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
