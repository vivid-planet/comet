"use client";
import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AiGeneratedBadge.module.scss";

interface AiGeneratedBadgeProps {
    isAiGenerated?: boolean;
    fill?: boolean;
}

/**
 * Wraps DAM media and overlays a label when the underlying file is marked as AI-generated.
 *
 * Disclosing AI-generated or AI-manipulated content is mandatory under the EU AI Act (Art. 50),
 * applicable from 2 August 2026. The European Commission provides official, freely usable labelling
 * icons that can replace the inline icon below:
 * https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content
 */
export const AiGeneratedBadge = ({ isAiGenerated, fill, children }: PropsWithChildren<AiGeneratedBadgeProps>) => {
    const intl = useIntl();

    if (!isAiGenerated) {
        return <>{children}</>;
    }

    const label = intl.formatMessage({ id: "aiGeneratedBadge.label", defaultMessage: "AI-generated" });

    return (
        <div className={clsx(styles.root, fill && styles.rootFill)}>
            {children}
            <span className={styles.badge} role="img" aria-label={label} title={label}>
                <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <text
                        x="12"
                        y="16.5"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.3"
                        fill="currentColor"
                        fontFamily="Arial, Helvetica, sans-serif"
                    >
                        AI
                    </text>
                </svg>
                <FormattedMessage id="aiGeneratedBadge.label" defaultMessage="AI-generated" />
            </span>
        </div>
    );
};
