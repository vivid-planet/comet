import { TableRow, WithStyles } from "@material-ui/core";
import { TableRowProps } from "@material-ui/core/TableRow";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export type TableBodyRowClassKey = "root" | "even" | "odd";

export interface TableBodyRowProps extends TableRowProps {
    index?: number;
    hideTableHead?: boolean;
}

const styles = () => {
    return createStyles<TableBodyRowClassKey, TableBodyRowProps>({
        root: {},
        even: {},
        odd: {},
    });
};

const Row = React.forwardRef<HTMLTableRowElement, TableBodyRowProps & WithStyles<typeof styles>>(
    ({ index, hideTableHead, classes, ...otherProps }, ref) => {
        const isOdd = ((index || 0) + (hideTableHead ? 1 : 0)) % 2 === 1;
        return <TableRow ref={ref} classes={{ root: `${classes.root} ${isOdd ? classes.odd : classes.even}` }} {...otherProps} />;
    },
);

export const TableBodyRow = withStyles(styles, { name: "CometAdminTableBodyRow" })(Row);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTableBodyRow: TableBodyRowClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminTableBodyRow: TableBodyRowProps;
    }
}
