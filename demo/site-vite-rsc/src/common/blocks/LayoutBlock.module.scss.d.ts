export type Styles = {
    box: string;
    layout1: string;
    layout2: string;
    layout3: string;
    layout4: string;
    layout5: string;
    layout6: string;
    layout7: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
