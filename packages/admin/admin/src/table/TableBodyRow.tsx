import { ComponentsOverrides, TableRow } from "@mui/material";
import { styled, Theme, useThemeProps } from "@mui/material/styles";
import { TableRowProps } from "@mui/material/TableRow";
import React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type TableBodyRowClassKey = "root" | "even" | "odd";

type OwnerState = { isOdd: boolean };

const Root = styled(TableRow, {
    name: "CometAdminTableBodyRow",
    slot: "root",
    overridesResolver({ ownerState: { isOdd } }: { ownerState: OwnerState }, styles) {
        return [styles.root, !isOdd && styles.even, isOdd && styles.odd];
    },
})<{ ownerState: OwnerState }>();

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface TableBodyRowProps extends ThemedComponentBaseProps<{ root: typeof TableRow }>, TableRowProps {
    index?: number;
    hideTableHead?: boolean;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function TableBodyRow(inProps: TableBodyRowProps) {
    const { title, children, index, hideTableHead, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminTableBodyRow" });

    const ownerState: OwnerState = {
        isOdd: ((index || 0) + (hideTableHead ? 1 : 0)) % 2 === 1,
    };

    return (
        <Root ownerState={ownerState} {...restProps} {...slotProps?.root}>
            {children}
        </Root>
    );
}

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
