export type Styles = {
    imageContainer: string;
    imageLeft: string;
    root: string;
    textContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
