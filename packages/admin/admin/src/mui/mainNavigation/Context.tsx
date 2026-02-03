import { type ComponentType, createContext, type Dispatch, type FunctionComponent, type SetStateAction, useContext } from "react";

export interface MainNavigationContext {
    open: boolean;
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
    drawerVariant: "temporary" | "permanent";
    setDrawerVariant: Dispatch<SetStateAction<"temporary" | "permanent">>;
    hasMultipleMenuItems: boolean;
    setHasMultipleMenuItems: Dispatch<SetStateAction<boolean>>;
}

export interface WithMainNavigation {
    mainNavigation: MainNavigationContext;
}
export const MainNavigationContext = createContext<MainNavigationContext>({
    open: false,
    toggleOpen: () => {
        // nothing
    },
    setOpen: () => {
        // nothing
    },
    drawerVariant: "permanent",
    setDrawerVariant: () => {
        // nothing
    },
    hasMultipleMenuItems: true,
    setHasMultipleMenuItems: () => {
        // nothing
    },
});

export const withMainNavigation = <P extends object>(WrappedComponent: ComponentType<P & WithMainNavigation>): FunctionComponent<P> => {
    return (props: P) => {
        return <MainNavigationContext.Consumer>{(value) => <WrappedComponent {...props} mainNavigation={value!} />}</MainNavigationContext.Consumer>;
    };
};

export const useMainNavigation = (): MainNavigationContext => {
    const context = useContext(MainNavigationContext);
    if (!context) {
        throw new Error("useMainNavigation must be used within a MainNavigationProvider");
    }
    return context;
};
