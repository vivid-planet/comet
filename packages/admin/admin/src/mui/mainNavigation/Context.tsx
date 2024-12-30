import { ComponentType, createContext, Dispatch, FunctionComponent, SetStateAction } from "react";

export interface IMainNavigationContext {
    open: boolean;
    toggleOpen: () => void;
    drawerVariant: "temporary" | "permanent";
    setDrawerVariant: Dispatch<SetStateAction<"temporary" | "permanent">>;
}

export interface IWithMainNavigation {
    mainNavigation: IMainNavigationContext;
}
export const MainNavigationContext = createContext<IMainNavigationContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
    drawerVariant: "permanent",
    setDrawerVariant: () => {
        // nothing
    },
});

export const withMainNavigation = <P extends object>(WrappedComponent: ComponentType<P & IWithMainNavigation>): FunctionComponent<P> => {
    return (props: P) => {
        return <MainNavigationContext.Consumer>{(value) => <WrappedComponent {...props} mainNavigation={value!} />}</MainNavigationContext.Consumer>;
    };
};
