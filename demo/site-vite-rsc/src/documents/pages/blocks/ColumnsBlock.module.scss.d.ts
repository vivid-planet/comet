export type Styles = {
    column: string;
    "layout-12-6": string;
    "layout-4-16-4": string;
    "layout-6-12": string;
    "layout-6-12-6": string;
    "layout-9-9": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
