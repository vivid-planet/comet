import { ComponentsOverrides, TableRow } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { TableRowProps } from "@mui/material/TableRow";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type TableBodyRowClassKey = "root" | "even" | "odd";

type OwnerState = Pick<TableBodyRowProps, "index" | "hideTableHead">;

const Root = styled(TableRow, {
    name: "CometAdminTableBodyRow",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        const isOdd = ((ownerState.index || 0) + (ownerState.hideTableHead ? 1 : 0)) % 2 === 1;
        return [styles.root, !isOdd && styles.even, isOdd && styles.odd];
    },
})<{ ownerState: OwnerState }>(({ ownerState: { index, hideTableHead } }) => {
    const isOdd = ((index || 0) + (hideTableHead ? 1 : 0)) % 2 === 1;
    if (isOdd) {
        return css``;
    }
    return css``;
});

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
        index,
        hideTableHead,
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
