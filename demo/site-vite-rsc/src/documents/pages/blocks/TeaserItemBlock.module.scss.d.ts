export type Styles = {
    contentContainer: string;
    link: string;
    linkText: string;
    mediaDesktop: string;
    mediaMobile: string;
    textLinkContainer: string;
    title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
