import { Button, Typography } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import clsx from "clsx";
import * as React from "react";

import { FilterBarActiveFilterBadge, FilterBarActiveFilterBadgeProps } from "../filterBarActiveFilterBadge/FilterBarActiveFilterBadge";
import { useStyles } from "./FilterBarButton.styles";

interface FilterBarButtonProps extends ButtonProps {
    dirtyFieldsBadge?: React.ComponentType<FilterBarActiveFilterBadgeProps>;
    countValue?: number;
}

export const FilterBarButton = ({
    children,
    dirtyFieldsBadge,
    countValue,
    startIcon,
    endIcon,
    ...buttonProps
}: FilterBarButtonProps): React.ReactElement => {
    const FilterBarActiveFilterBadgeComponent = dirtyFieldsBadge ? dirtyFieldsBadge : FilterBarActiveFilterBadge;
    const classes = useStyles();

    return (
        <Button className={classes.button} disableRipple {...buttonProps}>
            {startIcon && <span className={classes.startIcon}>{startIcon}</span>}
            <div className={clsx(classes.labelWrapper, countValue && countValue > 0 && classes.labelWrapperWithValues)}>
                <Typography variant="body1">{children}</Typography>
            </div>
            {countValue && <FilterBarActiveFilterBadgeComponent countValue={countValue} />}
            {endIcon && <span className={classes.endIcon}>{endIcon}</span>}
        </Button>
    );
};
