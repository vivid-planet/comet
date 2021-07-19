import { Typography } from "@material-ui/core";
import * as React from "react";

import { useStyles } from "./FilterBarActiveFilterBadge.styles";

export interface FilterBarActiveFilterBadgeProps {
    countValue: number;
}

export function FilterBarActiveFilterBadge({ countValue }: React.PropsWithChildren<FilterBarActiveFilterBadgeProps>) {
    const classes = useStyles();

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
