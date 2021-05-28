import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const dirtyFieldsCount = (values: Record<string, any>, results: string[] = []) => {
    const r = results;

    Object.keys(values).forEach((key) => {
        const value = values[key];
        if (typeof value !== "object") {
            if (Array.isArray(value)) {
                r.push(...value);
            } else {
                console.log("singleValue");
                r.push(value);
            }
        } else if (typeof value === "object") {
            dirtyFieldsCount(value, r);
        }
    });

    return r.length;
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
    calcNumberDirtyFields?: (values: Record<string, any>, results: string[]) => number;
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
