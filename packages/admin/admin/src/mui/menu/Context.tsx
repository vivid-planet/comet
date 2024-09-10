import { ComponentType, createContext, Dispatch, FunctionComponent, SetStateAction } from "react";

export interface IMenuContext {
    open: boolean;
    toggleOpen: () => void;
    drawerVariant: "temporary" | "permanent";
    setDrawerVariant: Dispatch<SetStateAction<"temporary" | "permanent">>;
}

export interface IWithMenu {
    menu: IMenuContext;
}
export const MenuContext = createContext<IMenuContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
    drawerVariant: "permanent",
    setDrawerVariant: () => {
        // nothing
    },
});

export const withMenu = <P extends object>(WrappedComponent: ComponentType<P & IWithMenu>): FunctionComponent<P> => {
    return (props: P) => {
        return <MenuContext.Consumer>{(value) => <WrappedComponent {...props} menu={value!} />}</MenuContext.Consumer>;
    };
};
