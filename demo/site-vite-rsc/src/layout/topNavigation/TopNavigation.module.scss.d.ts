export type Styles = {
    link: string;
    linkActive: string;
    skipLink: string;
    subLevelNavigation: string;
    topLevelLinkContainer: string;
    topLevelNavigation: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
