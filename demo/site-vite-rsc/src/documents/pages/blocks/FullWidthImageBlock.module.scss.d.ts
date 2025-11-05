export type Styles = {
    content: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
