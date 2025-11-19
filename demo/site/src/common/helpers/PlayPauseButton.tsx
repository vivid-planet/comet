import { type PlayPauseButtonProps } from "@comet/site-nextjs";
import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabel }: PlayPauseButtonProps) => {
    return (
        <button className={clsx(styles.button)} onClick={onClick} aria-label={ariaLabel ?? (isPlaying ? "Pause" : "Play")}>
            <div className={clsx(styles.animatedPlayPause, !isPlaying && styles.animatedPlayPausePaused)} />
        </button>
    );
};
