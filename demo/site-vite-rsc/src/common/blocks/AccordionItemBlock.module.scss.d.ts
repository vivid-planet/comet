export type Styles = {
    animatedChevron: string;
    animatedChevronExpanded: string;
    contentWrapper: string;
    contentWrapperExpanded: string;
    contentWrapperInner: string;
    titleWrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
