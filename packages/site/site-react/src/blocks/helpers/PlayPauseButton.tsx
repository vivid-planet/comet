import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

export interface PlayPauseButtonProps {
    isPlaying: boolean;
    onClick: () => void;
    ariaLabelPlay?: string;
    ariaLabelPause?: string;
}

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabelPlay, ariaLabelPause }: PlayPauseButtonProps) => {
    return (
        <button className={clsx(styles.button)} onClick={onClick} aria-label={isPlaying ? (ariaLabelPause ?? "Pause") : (ariaLabelPlay ?? "Play")}>
            <div className={clsx(styles.animatedPlayPause, isPlaying && styles.animatedPlayPausePaused)} />
        </button>
    );
};
