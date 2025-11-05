export type Styles = {
    h350: string;
    h400: string;
    h450: string;
    h500: string;
    h550: string;
    h600: string;
    noBottomSpacing: string;
    p200: string;
    p300: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
