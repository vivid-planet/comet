export type Styles = {
    button: string;
    contained: string;
    outlined: string;
    text: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
