export type Styles = {
    absoluteGridRoot: string;
    content: string;
    imageDesktop: string;
    imageLargeDesktop: string;
    imageMobile: string;
    imageOverlay: string;
    imageTablet: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
