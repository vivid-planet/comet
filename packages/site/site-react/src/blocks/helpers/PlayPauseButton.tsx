import clsx from "clsx";

import styles from "./PlayPauseButton.module.scss";

export interface PlayPauseButtonProps {
    isPlaying: boolean;
    onClick: () => void;
}

export interface ExtendedPlayPauseButtonProps extends PlayPauseButtonProps {
    ariaLabelPlay?: string;
    ariaLabelPause?: string;
}

export const PlayPauseButton = ({ isPlaying, onClick, ariaLabelPlay, ariaLabelPause }: ExtendedPlayPauseButtonProps) => {
    return (
        <button className={clsx(styles.button)} onClick={onClick} aria-label={isPlaying ? (ariaLabelPause ?? "Pause") : (ariaLabelPlay ?? "Play")}>
            <div className={clsx(styles.animatedPlayPause, !isPlaying && styles.animatedPlayPausePaused)} />
        </button>
    );
};
