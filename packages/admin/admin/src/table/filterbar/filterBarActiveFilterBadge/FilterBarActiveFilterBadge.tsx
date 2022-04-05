import { ComponentsOverrides, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBarActiveFilterBadge: FilterBarActiveFilterBadgeClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBarActiveFilterBadge: FilterBarActiveFilterBadgeProps;
    }

    interface Components {
        CometAdminFilterBarActiveFilterBadge?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBarActiveFilterBadge"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBarActiveFilterBadge"];
        };
    }
}
