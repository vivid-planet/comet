export type Styles = {
    mediaCaption: string;
    pageLayoutContent: string;
    swiperWrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
