import * as React from "react";

export default interface IStackApi {
    addBreadcrumb: (id: string, url: string, title: string) => void;
    updateBreadcrumb: (id: string, url: string, title: string) => void;
    removeBreadcrumb: (id: string) => void;
    goBack: () => void;
    goAllBack: () => void;
    goBackForce: () => void;
}
export const StackApiContext = React.createContext<IStackApi | undefined>(undefined);

/*
export function withStackApi(WrappedComponent: React.ComponentClass) {
    return React.forwardRef((props, ref) => {
        return (
            <StackApiContext.Consumer>
                {stackApi => <WrappedComponent {...props} stackApi={stackApi} ref={ref} />}
            </StackApiContext.Consumer>
        );
    });
}
*/
export interface IWithApiProps {
    stackApi?: IStackApi;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// TODO implement ref forwarding with typescript
export const withStackApi = <P extends IWithApiProps>(WrappedComponent: React.ComponentType<P>): React.SFC<Subtract<P, IWithApiProps>> => (
    props: any,
) => <StackApiContext.Consumer>{stackApi => <WrappedComponent {...props} stackApi={stackApi} />}</StackApiContext.Consumer>;
