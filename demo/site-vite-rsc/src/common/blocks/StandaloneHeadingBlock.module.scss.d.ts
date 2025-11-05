export type Styles = {
    pageLayoutContent: string;
    root: string;
    rootCenter: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
