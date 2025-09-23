import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

interface PlayPauseButtonProps {
    isPlaying: boolean;
    onClick: () => void;
    ariaLabel?: string;
    className?: string;
}

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabel, className }: PlayPauseButtonProps) => {
    return (
        <button
            className={clsx(styles.button, !isPlaying && styles.buttonPause, className)}
            onClick={onClick}
            aria-label={ariaLabel ?? (isPlaying ? "Pause" : "Play")}
        >
            <div className={styles.animatedPlayPause} />
        </button>
    );
};
