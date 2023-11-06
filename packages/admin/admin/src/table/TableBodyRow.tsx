import { ComponentsOverrides, TableRow, Theme } from "@mui/material";
import { TableRowProps } from "@mui/material/TableRow";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type TableBodyRowClassKey = "root" | "even" | "odd";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
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

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const TableBodyRow = withStyles(styles, { name: "CometAdminTableBodyRow" })(Row);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminTableBodyRow: TableBodyRowClassKey;
    }

    interface ComponentsPropsList {
        CometAdminTableBodyRow: Partial<TableBodyRowProps>;
    }

    interface Components {
        CometAdminTableBodyRow?: {
            defaultProps?: ComponentsPropsList["CometAdminTableBodyRow"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTableBodyRow"];
        };
    }
}
