import type { ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    quality?: number;
};

const Image = ({ fill, priority, quality, ...props }: ImageProps) => {
    return <img {...props} />;
};

export default Image;
