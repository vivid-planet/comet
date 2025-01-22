import { ComponentType, createContext, Dispatch, FunctionComponent, SetStateAction } from "react";

export interface MainNavigationContext {
    open: boolean;
    toggleOpen: () => void;
    drawerVariant: "temporary" | "permanent";
    setDrawerVariant: Dispatch<SetStateAction<"temporary" | "permanent">>;
}

export interface WithMainNavigation {
    mainNavigation: MainNavigationContext;
}
export const MainNavigationContext = createContext<MainNavigationContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
    drawerVariant: "permanent",
    setDrawerVariant: () => {
        // nothing
    },
});

export const withMainNavigation = <P extends object>(WrappedComponent: ComponentType<P & WithMainNavigation>): FunctionComponent<P> => {
    return (props: P) => {
        return <MainNavigationContext.Consumer>{(value) => <WrappedComponent {...props} mainNavigation={value!} />}</MainNavigationContext.Consumer>;
    };
};
