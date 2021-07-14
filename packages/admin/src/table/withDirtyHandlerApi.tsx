import * as React from "react";

import { DirtyHandlerApiContext, IDirtyHandlerApi } from "../DirtyHandlerApiContext";

export interface IWithDirtyHandlerApiProps {
    dirtyHandlerApi?: IDirtyHandlerApi;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// TODO implement ref forwarding with typescript
export const withDirtyHandlerApi =
    <P extends IWithDirtyHandlerApiProps>(WrappedComponent: React.ComponentType<P>): React.SFC<Subtract<P, IWithDirtyHandlerApiProps>> =>
    (props: any) =>
        (
            <DirtyHandlerApiContext.Consumer>
                {(dirtyHandlerApi) => <WrappedComponent {...props} dirtyHandlerApi={dirtyHandlerApi} />}
            </DirtyHandlerApiContext.Consumer>
        );
