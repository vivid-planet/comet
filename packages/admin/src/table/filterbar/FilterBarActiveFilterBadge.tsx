import { createStyles, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { useForm } from "react-final-form";

export type CometAdminFilterBarActiveFilterBadgeClassKeys = "hasValueCount";

export const dirtyFieldsCount = (values: Record<string, any>, registeredFields: string[] = [], fieldPath?: string) => {
    let count = 0;
    Object.entries(values).forEach(([fieldKey, fieldValue]) => {
        if (!fieldValue) {
            return;
        }

        const fieldName = fieldPath ? `${fieldPath}.${fieldKey}` : fieldKey;
        const isRegisteredField = registeredFields.includes(fieldName);
        if (Array.isArray(fieldValue) && isRegisteredField) {
            count += fieldValue.length;
        } else if (typeof fieldValue === "object") {
            if (Object.keys(fieldValue).length === 2 && "min" in fieldValue && "max" in fieldValue && isRegisteredField) {
                count++;
            } else {
                count += dirtyFieldsCount(fieldValue, registeredFields, fieldName);
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
    calcNumberDirtyFields?: (values: Record<string, any>, registeredFields: string[], fieldPath?: string) => number;
}

export const FilterBarActiveFilterBadgeComponent: React.FC<WithStyles<typeof styles, true> & FilterBarActiveFilterBadgeProps> = ({
    values,
    calcNumberDirtyFields = dirtyFieldsCount,
    classes,
}) => {
    const form = useForm();
    const registeredFields = form.getRegisteredFields();
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
