import * as React from "react";

import { RowActionsSubMenu, RowActionsSubMenuProps } from "./RowActionsSubMenu";

export type RowActionsMenuProps = Omit<RowActionsSubMenuProps, "menuIsOpen" | "openMenu" | "closeMenu">;

export const RowActionsMenu = (props: RowActionsMenuProps): React.ReactElement => {
    const [menuIsOpen, setMenuIsOpen] = React.useState(false);
    const { level: previousLevel, closeAllMenus: closeAllPreviousMenus } = React.useContext(RowActionsMenuContext);
    const level = previousLevel + 1;

    const closeAllMenus = () => {
        if (typeof closeAllPreviousMenus !== "undefined") {
            closeAllPreviousMenus();
        }
        setMenuIsOpen(false);
    };

    return (
        <RowActionsMenuContext.Provider value={{ level, closeAllMenus: closeAllMenus }}>
            {level === 1 ? (
                props.children
            ) : (
                <RowActionsSubMenu menuIsOpen={menuIsOpen} openMenu={() => setMenuIsOpen(true)} closeMenu={() => setMenuIsOpen(false)} {...props} />
            )}
        </RowActionsMenuContext.Provider>
    );
};

type RowActionsMenuContext = {
    level: number;
    closeAllMenus: () => void;
};

export const RowActionsMenuContext = React.createContext<RowActionsMenuContext>({
    level: 0,
    closeAllMenus: () => {
        // Do nothing, will be re-defined when using the context's provider.
    },
});
