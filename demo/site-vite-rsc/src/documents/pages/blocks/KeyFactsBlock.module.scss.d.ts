export type Styles = {
    itemWrapper: string;
    pageLayoutContent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
