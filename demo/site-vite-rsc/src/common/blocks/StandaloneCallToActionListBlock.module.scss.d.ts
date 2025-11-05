export type Styles = {
    center: string;
    left: string;
    pageLayoutContent: string;
    right: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
