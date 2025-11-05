export type Styles = {
    disableLastBottomSpacing: string;
    inlineLink: string;
    orderedListLevel0: string;
    orderedListLevel1: string;
    orderedListLevel2: string;
    pageLayoutContent: string;
    text: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
