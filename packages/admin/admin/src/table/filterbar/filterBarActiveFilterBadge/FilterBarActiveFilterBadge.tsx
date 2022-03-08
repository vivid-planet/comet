import { Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

import { FilterBarActiveFilterBadgeClassKey, styles } from "./FilterBarActiveFilterBadge.styles";

export interface FilterBarActiveFilterBadgeProps {
    countValue: number;
}

function FilterBadge({ countValue, classes }: React.PropsWithChildren<FilterBarActiveFilterBadgeProps> & WithStyles<typeof styles>) {
    if (countValue > 0) {
        return (
            <div className={classes.hasValueCount}>
                <Typography variant={"inherit"} display="block">
                    {countValue}
                </Typography>
            </div>
        );
    } else {
        return null;
    }
}

export const FilterBarActiveFilterBadge = withStyles(styles, { name: "CometAdminFilterBarActiveFilterBadge" })(FilterBadge);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarActiveFilterBadge: FilterBarActiveFilterBadgeClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFilterBarActiveFilterBadge: FilterBarActiveFilterBadgeProps;
    }
}
