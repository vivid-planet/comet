"use client";

import clsx from "clsx";

import { useThemeMode } from "./ThemeModeProvider";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    invertedClassName?: string;
};

// TODO: Allow custom component instead of hardcoding div
export const BlockRoot = ({ children, className, invertedClassName, ...rest }: Props) => {
    const themeMode = useThemeMode();

    return (
        <div {...rest} className={clsx(className, themeMode === "inverted" && invertedClassName)}>
            {children}
        </div>
    );
};
