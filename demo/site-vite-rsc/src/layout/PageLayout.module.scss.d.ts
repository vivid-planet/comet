export type Styles = {
    grid: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
