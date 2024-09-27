import { ComponentType, createContext, SFC, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { BreadcrumbItem, SwitchItem } from "./Stack";

export interface IStackApi {
    addBreadcrumb: (id: string, parentId: string, url: string, title: string | ComponentType<typeof FormattedMessage>, invisible: boolean) => void;
    updateBreadcrumb: (id: string, parentId: string, url: string, title: string | ComponentType<typeof FormattedMessage>, invisible: boolean) => void;
    removeBreadcrumb: (id: string) => void;
    goBack: () => void;
    goAllBack: () => void;

    addSwitchMeta: (id: string, options: { activePage: string; isInitialPageActive: boolean }) => void;
    removeSwitchMeta: (id: string) => void;
    switches: SwitchItem[];
    breadCrumbs: BreadcrumbItem[];
}
export const StackApiContext = createContext<IStackApi | undefined>(undefined);
export function useStackApi() {
    return useContext(StackApiContext);
}

/*
export function withStackApi(WrappedComponent: ComponentClass) {
    return forwardRef((props, ref) => {
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
export const withStackApi =
    <P extends IWithApiProps>(WrappedComponent: ComponentType<P>): SFC<Subtract<P, IWithApiProps>> =>
    (props: any) =>
        <StackApiContext.Consumer>{(stackApi) => <WrappedComponent {...props} stackApi={stackApi} />}</StackApiContext.Consumer>;
