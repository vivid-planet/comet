import clsx from "clsx";
import { type ReactNode } from "react";

import { type PixelImageBlockData } from "../../blocks.generated";
import { PixelImageBlock } from "../PixelImageBlock";
import styles from "./VideoPreviewImage.module.scss";

export interface VideoPreviewImageProps {
    onPlay: () => void;
    image: PixelImageBlockData;
    aspectRatio: string;
    sizes?: string;
    fill?: boolean;
    icon?: ReactNode;
    className?: string;
}

export const VideoPreviewImage = ({ onPlay, image, aspectRatio, sizes = "100vw", fill, icon = <PlayIcon />, className }: VideoPreviewImageProps) => {
    return (
        <div className={clsx(styles.root, fill && styles.fill, className)} tabIndex={-1}>
            <PixelImageBlock data={image} aspectRatio={aspectRatio} sizes={sizes} fill={fill} />
            <button className={styles.iconWrapper} onClick={onPlay} tabIndex={-1}>
                {icon}
            </button>
        </div>
    );
};

const PlayIcon = () => <span className={styles.playIcon} tabIndex={0} />;
