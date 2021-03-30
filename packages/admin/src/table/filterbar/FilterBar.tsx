import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { Field } from "../../form";
import { FilterBarPopOverFormField } from "./FilterBarPopOverFormField";

export type CometAdminFilterBarClassKeys = "root" | "barWrapper" | "sidebarInnerWrapper" | "fieldBarWrapper" | "moreButtonWrapper";

interface StyleProps {
    fieldBarWidth: number;
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            "& [class*='CometAdminFormFieldContainer-root']": {
                marginBottom: 0,
            },
        },
        barWrapper: {
            flexWrap: "wrap",
            display: "flex",
        },
        sidebarInnerWrapper: {},
        fieldBarWrapper: {
            minWidth: (props: StyleProps) => `${props.fieldBarWidth}px`,
            border: `1px solid ${theme.palette.grey[300]}`,
            position: "relative",
            marginBottom: "10px",
            marginRight: "10px",
        },
    }),
    { name: "CometAdminFilterBar" },
);

export interface IFilterBarField {
    name: string;
    label: string;
    component: React.ComponentType<any>;
}

interface IFilterBarProps {
    fieldBarWidth: number;
    fields: IFilterBarField[];
}

export const FilterBar: React.FunctionComponent<IFilterBarProps> = ({ fieldBarWidth, fields }) => {
    const classes = useStyles({ fieldBarWidth: fieldBarWidth });

    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>
                {fields.map((field, index) => {
                    return (
                        <div className={classes.fieldBarWrapper} style={{ minWidth: fieldBarWidth }} key={index}>
                            <Field type="query" name={field.name} component={FilterBarPopOverFormField} isClearable field={field} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
