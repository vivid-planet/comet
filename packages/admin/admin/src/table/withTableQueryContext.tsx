import * as React from "react";

import { ITableQueryContext, TableQueryContext } from "./TableQueryContext";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface IWithTableQueryProps {
    tableQuery?: ITableQueryContext;
}

/*
    return React.forwardRef((props, ref) => {
        return (
            <TableQueryApiContext.Consumer>
                {tableQueryApi => <WrappedComponent {...props} tableQueryApi={tableQueryApi} forwardedRef={ref} />}
            </TableQueryApiContext.Consumer>
        );
    });
    */
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// TODO implement ref forwarding with typescript
/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export const withTableQueryContext =
    <P extends IWithTableQueryProps>(WrappedComponent: React.ComponentType<P>): React.SFC<Subtract<P, IWithTableQueryProps>> =>
    (props: any) =>
        <TableQueryContext.Consumer>{(tableQuery) => <WrappedComponent {...props} tableQuery={tableQuery} />}</TableQueryContext.Consumer>;
