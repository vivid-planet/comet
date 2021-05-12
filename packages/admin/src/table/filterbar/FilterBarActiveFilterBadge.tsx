import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import { FieldState } from "final-form";
import { isEmpty } from "lodash";
import * as React from "react";

import { difference } from "./difference";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const dirtyFieldsCount = (fieldState?: FieldState<any>) => {
    if (Array.isArray(fieldState?.value[Object.keys(fieldState?.value)[0]])) {
        return fieldState?.value[Object.keys(fieldState?.value)[0]].length;
    } else {
        if (fieldState?.initial) {
            const diff = difference<any, Record<string, any>>(fieldState?.value, fieldState?.initial);
            return Object.keys(diff).length;
        }
        return Object.keys(fieldState?.value).length;
    }
};

const styles = (theme: Theme) =>
    createStyles<CometAdminFilterBarActiveFilterBadgeClassKeys, FilterBarActiveFilterBadgeProps>({
        hasValueCount: {
            backgroundColor: `${theme.palette.grey[100]}`,
            textAlign: "center",
            borderRadius: "4px",
            padding: "0 5px",
            height: "20px",
        },
    });

export interface FilterBarActiveFilterBadgeProps<T = any> {
    fieldState?: FieldState<T>;
    calcNumberDirtyFields?: (fieldState?: FieldState<T>) => number;
}

export const FilterBarActiveFilterBadgeComponent: React.FC<WithStyles<typeof styles, true> & FilterBarActiveFilterBadgeProps> = ({
    fieldState,
    calcNumberDirtyFields = dirtyFieldsCount,
    classes,
}) => {
    const count = !isEmpty(fieldState?.value) ? calcNumberDirtyFields(fieldState) : 0;
    if (count > 0) {
        return (
            <div className={classes.hasValueCount}>
                <Typography variant={"subtitle2"}>{count}</Typography>
            </div>
        );
    } else {
        return null;
    }
};

export const FilterBarActiveFilterBadge = withStyles(styles, { name: "CometAdminFilterBarActiveFilterBadge", withTheme: false })(
    FilterBarActiveFilterBadgeComponent,
);
