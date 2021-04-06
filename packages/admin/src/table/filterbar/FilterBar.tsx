import { Theme, Typography } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
        showMoreWrapper: {
            minWidth: (props: StyleProps) => `${props.fieldBarWidth}px`,
            border: `1px solid ${theme.palette.grey[300]}`,
            position: "relative",
            marginBottom: "10px",
            marginRight: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
        },
        showMoreTextWrapper: {
            marginLeft: "15px",
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
    maxCountInitialShown?: number;
}

export const FilterBar: React.FunctionComponent<IFilterBarProps> = ({ fieldBarWidth, fields, maxCountInitialShown = 10 }) => {
    const classes = useStyles({ fieldBarWidth: fieldBarWidth });
    const [hasExtended, setHasExtended] = React.useState(false);

    return (
        <div className={classes.root}>
            <div className={classes.barWrapper}>
                {Array.from(
                    {
                        length:
                            hasExtended && maxCountInitialShown < fields.length
                                ? fields.length
                                : maxCountInitialShown > fields.length
                                ? fields.length
                                : maxCountInitialShown,
                    },
                    (_, i) => i,
                ).map((i) => {
                    return (
                        <div className={classes.fieldBarWrapper} style={{ minWidth: fieldBarWidth }} key={i}>
                            <Field type="query" name={fields[i].name} component={FilterBarPopOverFormField} isClearable field={fields[i]} />
                        </div>
                    );
                })}
                {fields.length > maxCountInitialShown && !hasExtended && (
                    <div className={classes.showMoreWrapper} style={{ minWidth: fieldBarWidth }} onClick={() => setHasExtended(true)}>
                        <MoreHoriz />
                        <div className={classes.showMoreTextWrapper}>
                            <Typography variant="subtitle2">
                                <FormattedMessage id="cometAdmin.generic.moreFilter" defaultMessage="Mehr Filter" />
                            </Typography>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
