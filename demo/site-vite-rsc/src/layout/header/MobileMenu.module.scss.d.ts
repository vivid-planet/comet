export type Styles = {
    backButton: string;
    buttonBase: string;
    link: string;
    menuButton: string;
    menuContainer: string;
    menuContainerOpen: string;
    overviewButton: string;
    pageLayoutContent: string;
    root: string;
    subLevelNavigation: string;
    subLevelNavigationExpanded: string;
    topLevelNavigation: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
