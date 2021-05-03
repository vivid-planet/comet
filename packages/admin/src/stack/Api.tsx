import * as React from "react";

import { IBreadcrumbItem, ISwitchItem } from "./Stack";

export interface IStackApi {
    addBreadcrumb: (id: string, parentId: string, url: string, title: React.ReactNode) => void;
    updateBreadcrumb: (id: string, parentId: string, url: string, title: React.ReactNode) => void;
    removeBreadcrumb: (id: string) => void;
    goBack: () => void;
    goAllBack: () => void;

    addSwitchMeta: (id: string, options: { activePage: string; isInitialPageActive: boolean }) => void;
    removeSwitchMeta: (id: string) => void;
    switches: ISwitchItem[];
    breadCrumbs: IBreadcrumbItem[];
}
export const StackApiContext = React.createContext<IStackApi | undefined>(undefined);
export function useStackApi() {
    return React.useContext(StackApiContext);
}

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
) => <StackApiContext.Consumer>{(stackApi) => <WrappedComponent {...props} stackApi={stackApi} />}</StackApiContext.Consumer>;
