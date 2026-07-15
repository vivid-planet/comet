import clsx from "clsx";

import styles from "./AiContentDisclosure.module.scss";
import { AiGeneratedBlackIcon } from "./icons/AiGeneratedBlackIcon";
import { AiGeneratedWhiteIcon } from "./icons/AiGeneratedWhiteIcon";
import { AiModifiedBlackIcon } from "./icons/AiModifiedBlackIcon";
import { AiModifiedWhiteIcon } from "./icons/AiModifiedWhiteIcon";

export type AiContentType = "Generated" | "Modified";

const icons = {
    Generated: { black: AiGeneratedBlackIcon, white: AiGeneratedWhiteIcon },
    Modified: { black: AiModifiedBlackIcon, white: AiModifiedWhiteIcon },
} satisfies Record<AiContentType, { black: unknown; white: unknown }>;

export interface AiContentDisclosureProps {
    /** Which EU label to show: fully AI-generated or partially AI-modified content. */
    type: AiContentType;
    /**
     * Pill color. "auto" (default) picks the black pill on light backgrounds and the white pill on
     * dark ones via `prefers-color-scheme`. Use "light"/"dark" to force one.
     */
    variant?: "auto" | "light" | "dark";
    /** Absolutely position the badge in the bottom-left corner of a positioned ancestor. Default: true. */
    overlay?: boolean;
    className?: string;
}

/**
 * Visual AI-content disclosure badge using the official EU AI-content labels (Article 50 AI Act).
 *
 * The badge is decorative (`aria-hidden`): the machine-readable disclosure must be carried by the
 * accessible name of the associated media element (see `aiContentDisclosureAltText`), so screen-reader
 * users learn which asset is AI-generated.
 */
export function AiContentDisclosure({ type, variant = "auto", overlay = true, className }: AiContentDisclosureProps) {
    const BlackIcon = icons[type].black;
    const WhiteIcon = icons[type].white;

    return (
        <span className={clsx(styles.root, overlay && styles.overlay, className)} aria-hidden="true">
            {variant !== "dark" && <BlackIcon className={clsx(styles.icon, variant === "auto" && styles.iconLight)} />}
            {variant !== "light" && <WhiteIcon className={clsx(styles.icon, variant === "auto" && styles.iconDark)} />}
        </span>
    );
}
