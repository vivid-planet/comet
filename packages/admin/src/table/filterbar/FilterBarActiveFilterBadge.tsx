import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const dirtyFieldsCount = (values: Record<string, any>) => {
    return Object.values(values).reduce((acc, val) => {
        if (val) {
            if (Array.isArray(val)) {
                acc += val.length;
            }
            acc++;
        }
        return acc;
    }, 0);
    /*
    TODO: what is the use case of this?
    if (fieldState?.initial) {
        const diff = difference<any, Record<string, any>>(fieldState?.value, fieldState?.initial);
        return Object.keys(diff).length;
    }
    */
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

export interface FilterBarActiveFilterBadgeProps {
    values: Record<string, any>;
    calcNumberDirtyFields?: (values: Record<string, any>) => number;
}

export const FilterBarActiveFilterBadgeComponent: React.FC<WithStyles<typeof styles, true> & FilterBarActiveFilterBadgeProps> = ({
    values,
    calcNumberDirtyFields = dirtyFieldsCount,
    classes,
}) => {
    const count = calcNumberDirtyFields(values);
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
