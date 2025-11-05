export type Styles = {
    absoluteGridRoot: string;
    content: string;
    imageOverlay: string;
    mediaDesktop: string;
    mediaPhone: string;
    mediaTablet: string;
    mediaTabletLandscape: string;
    root: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
