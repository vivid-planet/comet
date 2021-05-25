import { TableRow } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { TableRowProps } from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

export interface TableBodyRowProps extends TableRowProps {
    index?: number;
    hideTableHead?: boolean;
}

export const TableBodyRow = ({ index, hideTableHead, ...otherProps }: TableBodyRowProps) => {
    const classes = useStyles();
    const isOdd = ((index || 0) + (hideTableHead ? 1 : 0)) % 2 === 1;
    return <TableRow classes={{ root: isOdd ? classes.odd : classes.even }} {...otherProps} />;
};

export type CometAdminTableBodyRowClassKeys = "even" | "odd";

export const useStyles = makeStyles<Theme, {}, CometAdminTableBodyRowClassKeys>(
    ({ palette }) => ({
        even: {
            backgroundColor: "#fff",
        },
        odd: {
            backgroundColor: palette.grey[50],
        },
    }),
    { name: "CometAdminTableBodyRow" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTableBodyRow: CometAdminTableBodyRowClassKeys;
    }
}
