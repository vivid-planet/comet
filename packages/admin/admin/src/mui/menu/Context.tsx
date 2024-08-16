import * as React from "react";

export interface IMenuContext {
    open: boolean;
    toggleOpen: () => void;
    drawerVariant: "temporary" | "permanent";
    setDrawerVariant: React.Dispatch<React.SetStateAction<"temporary" | "permanent">>;
}

export interface IWithMenu {
    menu: IMenuContext;
}
export const MenuContext = React.createContext<IMenuContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
    drawerVariant: "permanent",
    setDrawerVariant: () => {
        // nothing
    },
});

export const withMenu = <P extends object>(WrappedComponent: React.ComponentType<P & IWithMenu>): React.FunctionComponent<P> => {
    return (props: P) => {
        return <MenuContext.Consumer>{(value) => <WrappedComponent {...props} menu={value!} />}</MenuContext.Consumer>;
    };
};
