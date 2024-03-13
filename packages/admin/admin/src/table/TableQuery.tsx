import { ApolloError } from "@apollo/client";
import { ComponentsOverrides, Paper } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Loading } from "../common/Loading";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { ITableQueryApi, TableQueryContext } from "./TableQueryContext";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDefaultVariables {}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type TableQueryClassKey = "root" | "loadingContainer" | "loadingPaper";

const Root = createComponentSlot("div")<TableQueryClassKey>({
    componentName: "TableQuery",
    slotName: "root",
})(css`
    position: relative;
`);

const LoadingContainer = createComponentSlot("div")<TableQueryClassKey>({
    componentName: "TableQuery",
    slotName: "loadingContainer",
})(
    ({ theme }) => css`
        position: sticky;
        top: 0;
        width: 100%;
        z-index: ${theme.zIndex.modal};
        transform: translate(50%, 200px);
    `,
);

const LoadingPaper = createComponentSlot(Paper)<TableQueryClassKey>({
    componentName: "TableQuery",
    slotName: "loadingPaper",
})(css`
    display: flex;
    position: absolute;
    transform: translate(-50%, -50%);
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    height: 100px;
    width: 100px;
`);

export interface TableQueryProps
    extends ThemedComponentBaseProps<{
        root: "div";
        loadingContainer: "div";
        loadingPaper: typeof Paper;
    }> {
    api: ITableQueryApi;
    loading: boolean;
    error?: ApolloError;
    children: React.ReactNode;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export function TableQuery(inProps: TableQueryProps) {
    const { loading, error, children, api, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminTableQuery" });

    return (
        <TableQueryContext.Provider
            value={{
                api,
            }}
        >
            <Root {...slotProps?.root} {...restProps}>
                <LoadingContainer {...slotProps?.loadingContainer}>
                    {loading && (
                        <LoadingPaper {...slotProps?.loadingPaper}>
                            <Loading behavior="fillParent" />
                        </LoadingPaper>
                    )}
                </LoadingContainer>
                {error && (
                    <p>
                        <FormattedMessage
                            id="comet.table.tableQuery.error"
                            defaultMessage="Error :( {error}"
                            description="Display apollo error message"
                            values={{
                                error: error.toString(),
                            }}
                        />
                    </p>
                )}
                {children}
            </Root>
        </TableQueryContext.Provider>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminTableQuery: TableQueryProps;
    }

    interface ComponentNameToClassKey {
        CometAdminTableQuery: TableQueryClassKey;
    }

    interface Components {
        CometAdminTableQuery?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminTableQuery"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminTableQuery"];
        };
    }
}
