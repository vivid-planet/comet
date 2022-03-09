import * as React from "react";

export interface IMenuContext {
    open: boolean;
    toggleOpen: () => void;
}

export interface IWithMenu {
    menu: IMenuContext;
}

export const MenuContext = React.createContext<IMenuContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
});

export const withMenu = <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P & IWithMenu>): React.FunctionComponent<P> => {
    return (props: Exclude<P, IWithMenu>) => {
        return <MenuContext.Consumer>{(value) => <WrappedComponent {...props} menu={value} />}</MenuContext.Consumer>;
    };
};
