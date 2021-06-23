import { TableRow } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import { TableRowProps } from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";

export interface TableBodyRowProps extends TableRowProps {
    index?: number;
    hideTableHead?: boolean;
}

export const TableBodyRow = React.forwardRef<HTMLTableRowElement, TableBodyRowProps & StyledComponentProps<CometAdminTableBodyRowClassKeys>>(
    ({ index, hideTableHead, classes: passedClasses, ...otherProps }, ref) => {
        const classes = mergeClasses<CometAdminTableBodyRowClassKeys>(useStyles(), passedClasses);
        const isOdd = ((index || 0) + (hideTableHead ? 1 : 0)) % 2 === 1;
        return <TableRow ref={ref} classes={{ root: `${classes.root} ${isOdd ? classes.odd : classes.even}` }} {...otherProps} />;
    },
);

export type CometAdminTableBodyRowClassKeys = "root" | "even" | "odd";

export const useStyles = makeStyles<Theme, {}, CometAdminTableBodyRowClassKeys>(
    () => ({
        root: {},
        even: {},
        odd: {},
    }),
    { name: "CometAdminTableBodyRow" },
);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTableBodyRow: CometAdminTableBodyRowClassKeys;
    }
}
