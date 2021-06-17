import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { useForm } from "react-final-form";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

const isRangeValue = (value: Record<string, any>): boolean => {
    return Object.keys(value).length === 2 && "min" in value && "max" in value;
};

export const dirtyFieldsCount = (values: Record<string, any>, registeredFields: string[]) => {
    let count = 0;
    Object.entries(values).forEach(([fieldName, fieldValue]) => {
        if (!fieldValue) {
            return;
        }

        const isRegisteredField = registeredFields.includes(fieldName);

        if (Array.isArray(fieldValue) && isRegisteredField) {
            count += fieldValue.length;
        } else if (typeof fieldValue === "object") {
            if (isRangeValue(fieldValue) && isRegisteredField) {
                count++;
            } else {
                const registeredSubFields = registeredFields.reduce((res, field) => {
                    if (field.startsWith(`${fieldName}.`)) {
                        //remove field prefix for recursive call
                        res.push(field.substr(fieldName.length + 1));
                    }
                    return res;
                }, [] as string[]);
                count += dirtyFieldsCount(fieldValue, registeredSubFields);
            }
        } else if (isRegisteredField) {
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
    const countValue = calcNumberDirtyFields(values, form.getRegisteredFields());

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
