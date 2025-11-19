import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

export interface PlayPauseButtonProps {
    isPlaying: boolean;
    onClick: () => void;
    ariaLabel?: string;
}

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabel }: PlayPauseButtonProps) => {
    return (
        <button className={clsx(styles.button)} onClick={onClick} aria-label={ariaLabel ?? (isPlaying ? "Pause" : "Play")}>
            <div className={clsx(styles.animatedPlayPause, !isPlaying && styles.animatedPlayPausePaused)} />
        </button>
    );
};
