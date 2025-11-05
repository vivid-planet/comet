export type Styles = {
    animatedChevron: string;
    animatedChevronExpanded: string;
    closeSublevelNavigationButton: string;
    desktopHeaderFullHeightNav: string;
    linkContainer: string;
    menuPageLink: string;
    menuPageLinkActive: string;
    subLevelNavigation: string;
    subLevelNavigationExpanded: string;
    toggleSubLevelNavigationButton: string;
    topLevelLinkContainer: string;
    topLevelNavigation: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
