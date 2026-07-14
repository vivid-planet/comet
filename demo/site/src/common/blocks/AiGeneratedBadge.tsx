"use client";
import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AiGeneratedBadge.module.scss";

type AiGeneration = "AiGenerated" | "FullyAiGenerated" | "PartiallyAiModified";

interface AiGeneratedBadgeProps {
    aiGeneration?: AiGeneration | null;
    fill?: boolean;
}

const labels: Record<AiGeneration, { id: string; defaultMessage: string }> = {
    AiGenerated: { id: "aiGeneratedBadge.aiGenerated", defaultMessage: "AI-generated" },
    FullyAiGenerated: { id: "aiGeneratedBadge.fullyAiGenerated", defaultMessage: "Fully AI-generated" },
    PartiallyAiModified: { id: "aiGeneratedBadge.partiallyAiModified", defaultMessage: "Partially AI-modified" },
};

/**
 * Wraps DAM media and overlays a label when the underlying file is marked as AI-generated.
 *
 * Disclosing AI-generated or AI-manipulated content is mandatory under the EU AI Act (Art. 50),
 * applicable from 2 August 2026. The label distinguishes the three cases the official EU icon set
 * covers (general, fully generated, partially modified). The freely usable EU icons can replace the
 * inline mark below: https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content
 */
export const AiGeneratedBadge = ({ aiGeneration, fill, children }: PropsWithChildren<AiGeneratedBadgeProps>) => {
    const intl = useIntl();

    if (!aiGeneration) {
        return <>{children}</>;
    }

    const label = intl.formatMessage(labels[aiGeneration]);

    return (
        <div className={clsx(styles.root, fill && styles.rootFill)}>
            {children}
            <span className={styles.badge} role="img" aria-label={label} title={label}>
                <AiIcon variant={aiGeneration} />
                <FormattedMessage {...labels[aiGeneration]} />
            </span>
        </div>
    );
};

const AiIcon = ({ variant }: { variant: AiGeneration }) => {
    const filled = variant === "FullyAiGenerated";
    return (
        <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" />
            <text
                x="12"
                y="16.5"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.3"
                fill={filled ? "#000" : "currentColor"}
                fontFamily="Arial, Helvetica, sans-serif"
            >
                AI
            </text>
            {variant === "PartiallyAiModified" && <circle cx="19" cy="5" r="3.4" fill="currentColor" stroke="#000" strokeWidth="0.8" />}
        </svg>
    );
};
