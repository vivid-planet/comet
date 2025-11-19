import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

export interface PlayPauseButtonProps {
    isPlaying: boolean;
    onClick: () => void;
    ariaLabel?: string;
    className?: string;
}

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabel, className }: PlayPauseButtonProps) => {
    return (
        <button className={clsx(styles.button, className)} onClick={onClick} aria-label={ariaLabel ?? (isPlaying ? "Pause" : "Play")}>
            <div className={clsx(styles.animatedPlayPause, !isPlaying && styles.animatedPlayPausePaused)} />
        </button>
    );
};
