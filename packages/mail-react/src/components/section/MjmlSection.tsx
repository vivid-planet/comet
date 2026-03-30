import { type IMjmlGroupProps, type IMjmlSectionProps, MjmlGroup, MjmlSection as BaseMjmlSection } from "@faire/mjml-react";
import type { ReactNode } from "react";

export type MjmlSectionProps = IMjmlSectionProps & {
    /** When true, child columns remain side-by-side on mobile instead of stacking vertically. */
    disableResponsiveBehavior?: boolean;
    /** Props forwarded to internal sub-components. */
    slotProps?: {
        /** Props passed to the wrapping `MjmlGroup` when `disableResponsiveBehavior` is enabled. */
        group?: Partial<IMjmlGroupProps>;
    };
};

/**
 * A section wrapper for email layouts. Must be a direct child of `MjmlBody`.
 *
 * Extends the base MJML `<mj-section>` with an option to disable responsive
 * column stacking on mobile viewports by wrapping children in `MjmlGroup`.
 */
export function MjmlSection({ children, disableResponsiveBehavior, slotProps, ...props }: MjmlSectionProps): ReactNode {
    return (
        <BaseMjmlSection {...props}>
            {disableResponsiveBehavior ? <MjmlGroup {...slotProps?.group}>{children}</MjmlGroup> : <>{children}</>}
        </BaseMjmlSection>
    );
}
