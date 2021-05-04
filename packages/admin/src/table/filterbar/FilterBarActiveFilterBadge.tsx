import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { FieldState } from "final-form";
import { isEqual } from "lodash";
import * as React from "react";

import { difference } from "./difference";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const dirtyFieldsCount = (fieldState?: FieldState<any>) => {
    if (fieldState?.initial) {
        const diff = difference<any, Record<string, any>>(fieldState?.value, fieldState?.initial);
        return Object.keys(diff).length;
    }
    return Object.keys(fieldState?.value).length;
};

const styles = (theme: Theme) =>
    createStyles<CometAdminFilterBarActiveFilterBadgeClassKeys, any>({
        hasValueCount: {
            backgroundColor: `${theme.palette.grey[100]}`,
            textAlign: "center",
            borderRadius: "4px",
            height: "20px",
            width: "17px",
        },
    });

interface FilterBarActiveFilterBadgeProps {
    fieldState?: FieldState<any>;
}

const FilterBarActiveFilterBadgeComponent: React.FC<WithStyles<typeof styles, true> & FilterBarActiveFilterBadgeProps> = ({
    fieldState,
    classes,
}) => {
    if (!isEqual(fieldState?.value, fieldState?.initial)) {
        return (
            <div className={classes.hasValueCount}>
                <Typography variant={"subtitle2"}>
                    {Array.isArray(fieldState?.value)
                        ? fieldState?.value.length
                        : typeof fieldState?.value === "object"
                        ? dirtyFieldsCount(fieldState)
                        : 1}
                </Typography>
            </div>
        );
    } else {
        return null;
    }
};

export const FilterBarActiveFilterBadge = withStyles(styles, { name: "CometAdminFilterBarActiveFilterBadge", withTheme: false })(
    FilterBarActiveFilterBadgeComponent,
);
