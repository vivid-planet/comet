"use client";

import clsx from "clsx";

import styles from "./TextBlock.module.scss";
import { useThemeMode } from "./ThemeModeProvider";

export const TextBlock = ({ text }: { text: string }) => {
    const themeMode = useThemeMode();

    return (
        <div className={clsx(styles.root, themeMode === "inverted" && styles["root--inverted"])}>
            <h4>Text Block</h4>
            <p>{text}</p>
        </div>
    );
};
