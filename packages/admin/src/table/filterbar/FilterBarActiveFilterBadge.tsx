import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import set from "lodash.set";
import * as React from "react";
import { useForm } from "react-final-form";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

const isRangeValue = (value: Record<string, any>): boolean => {
    return Object.keys(value).length === 2 && "min" in value && "max" in value;
};

export const dirtyFieldsCount = (values: Record<string, any>, registeredFields: Record<string, any>) => {
    let count = 0;
    Object.entries(registeredFields).forEach(([namePrefix, registeredSubFields]) => {
        const fieldValue = values[namePrefix];
        if (!fieldValue) {
            return;
        }

        if (Array.isArray(fieldValue)) {
            count += fieldValue.length;
        } else if (typeof fieldValue === "object") {
            if (isRangeValue(fieldValue)) {
                count++;
            } else {
                count += dirtyFieldsCount(fieldValue, registeredSubFields);
            }
        } else {
            count++;
        }
    });

    return count;
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
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: Record<string, any>) => number;
}

export const FilterBarActiveFilterBadgeComponent: React.FC<WithStyles<typeof styles, true> & FilterBarActiveFilterBadgeProps> = ({
    values,
    calcNumberDirtyFields = dirtyFieldsCount,
    classes,
}) => {
    const form = useForm();
    // create same structure like final form (https://final-form.org/docs/final-form/field-names)
    const registeredFields = form.getRegisteredFields().reduce((fields, fieldName) => set(fields, fieldName, true), {});
    const countValue = calcNumberDirtyFields(values, registeredFields);

    if (countValue > 0) {
        return (
            <div className={classes.hasValueCount}>
                <Typography variant={"subtitle2"}>{countValue}</Typography>
            </div>
        );
    } else {
        return null;
    }
};

export const FilterBarActiveFilterBadge = withStyles(styles, { name: "CometAdminFilterBarActiveFilterBadge", withTheme: false })(
    FilterBarActiveFilterBadgeComponent,
);
