import { type IMjmlGroupProps, type IMjmlSectionProps, MjmlGroup, MjmlSection as BaseMjmlSection } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { registerStyles } from "../../styles/registerStyles.js";
import { getDefaultFromResponsiveValue, getResponsiveOverrides } from "../../theme/responsiveValue.js";
import { useOptionalTheme } from "../../theme/ThemeProvider.js";
import type { Theme } from "../../theme/themeTypes.js";
import { css } from "../../utils/css.js";

export type MjmlSectionProps = IMjmlSectionProps & {
    /** Applies theme-based content indentation with responsive overrides. */
    indent?: boolean;
    /** When true, child columns remain side-by-side on mobile instead of stacking vertically. */
    disableResponsiveBehavior?: boolean;
    /** Props forwarded to internal sub-components. */
    slotProps?: {
        /** Props passed to the wrapping `MjmlGroup` when `disableResponsiveBehavior` is enabled. */
        group?: Partial<IMjmlGroupProps>;
    };
};

/** A section wrapper for email layouts. Must be a direct child of `MjmlBody`. */
export function MjmlSection({ children, indent, disableResponsiveBehavior, slotProps, className, ...restProps }: MjmlSectionProps): ReactNode {
    const theme = useOptionalTheme();

    const indentProps = indent ? getIndentProps(theme) : {};
    const resolvedClassName = clsx("mjmlSection", indent && "mjmlSection--indented", className);

    const themeBackgroundProps = theme ? { backgroundColor: theme.colors.background.content } : {};

    return (
        <BaseMjmlSection className={resolvedClassName} {...themeBackgroundProps} {...indentProps} {...restProps}>
            {disableResponsiveBehavior ? <MjmlGroup {...slotProps?.group}>{children}</MjmlGroup> : <>{children}</>}
        </BaseMjmlSection>
    );
}

function getIndentProps(theme: Theme | null): Pick<IMjmlSectionProps, "paddingLeft" | "paddingRight"> {
    if (theme === null) {
        throw new Error("The `indent` prop requires being wrapped in a ThemeProvider or MjmlMailRoot.");
    }

    return {
        paddingLeft: getDefaultFromResponsiveValue(theme.sizes.contentIndentation),
        paddingRight: getDefaultFromResponsiveValue(theme.sizes.contentIndentation),
    };
}

registerStyles((theme) => {
    const overrides = getResponsiveOverrides(theme.sizes.contentIndentation);
    if (overrides.length === 0) {
        return css``;
    }

    return overrides
        .map((override) => {
            const breakpoint = theme.breakpoints[override.breakpointKey];
            if (!breakpoint) {
                return "";
            }
            return css`
                ${breakpoint.belowMediaQuery} {
                    .mjmlSection--indented > table > tbody > tr > td {
                        padding-left: ${override.value}px !important;
                        padding-right: ${override.value}px !important;
                    }
                }
            `;
        })
        .join("\n");
});
