import * as React from "react";
import Switch from "./Switch";

export default interface IStackApi {
    addBreadcrumb: (id: string, parentId: string, url: string, title: string) => void;
    updateBreadcrumb: (id: string, parentId: string, url: string, title: string) => void;
    removeBreadcrumb: (id: string) => void;
    goBack: () => void;
    goAllBack: () => void;
    goBackForce: () => void;

    addSwitchMeta: (id: string, options: { activePage: string; isInitialPageActive: boolean }) => void;
    removeSwitchMeta: (id: string) => void;
    switches: Array<{
        id: string;
        isInitialPageActive: boolean;
    }>;
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
