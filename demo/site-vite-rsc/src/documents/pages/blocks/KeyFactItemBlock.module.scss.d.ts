export type Styles = {
    description: string;
    fact: string;
    icon: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
