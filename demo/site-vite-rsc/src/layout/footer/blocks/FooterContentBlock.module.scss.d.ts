export type Styles = {
    copyrightNotice: string;
    horizontalLine: string;
    imageWrapper: string;
    linkCopyrightWrapper: string;
    linksWrapper: string;
    linkText: string;
    pageLayoutContent: string;
    richTextWrapper: string;
    root: string;
    topContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
