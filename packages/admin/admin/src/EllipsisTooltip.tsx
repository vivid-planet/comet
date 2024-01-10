import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import React from "react";

import { Tooltip as CommonTooltip } from "./common/Tooltip";
import { ThemedComponentBaseProps } from "./helpers/ThemedComponentBaseProps";

export type EllipsisTooltipClassKey = "root" | "tooltip";

export interface EllipsisTooltipProps
    extends ThemedComponentBaseProps<{
        root: "div";
        tooltip: typeof CommonTooltip;
    }> {
    children?: React.ReactNode;
}

const Root = styled("div", {
    name: "CometAdminEllipsisTooltip",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`);

const Tooltip = styled(CommonTooltip, {
    name: "CometAdminEllipsisTooltip",
    slot: "tooltip",
    overridesResolver(_, styles) {
        return [styles.tooltip];
    },
})();

export const EllipsisTooltip = (inProps: EllipsisTooltipProps) => {
    const { children, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminEllipsisTooltip" });
    const rootRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLSpanElement>(null);
    const [renderWithTooltip, setRenderWithTooltip] = React.useState(false);

    const updateRenderWithTooltip = React.useCallback(() => {
        if (rootRef.current && contentRef.current) {
            setRenderWithTooltip(contentRef.current.offsetWidth > rootRef.current.clientWidth);
        }
        // The dependency array items must be `.current`, otherwise the callback will not be called, when the html-element is rendered.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rootRef.current, contentRef.current]);

    React.useEffect(() => {
        const rootElement = rootRef.current;
        const resizeObserver = new ResizeObserver(updateRenderWithTooltip);
        const mutationObserver = new MutationObserver(updateRenderWithTooltip);

        if (rootElement) {
            resizeObserver.observe(rootElement);
            mutationObserver.observe(rootElement, {
                characterData: true,
                childList: true,
                subtree: true,
            });
        }

        return () => {
            if (rootElement) {
                resizeObserver.unobserve(rootElement);
            }

            mutationObserver.disconnect();
        };
    }, [rootRef, contentRef, updateRenderWithTooltip]);

    const content = <span ref={contentRef}>{children}</span>;

    return (
        <Root ref={rootRef} {...restProps} {...slotProps?.root}>
            {renderWithTooltip ? (
                <Tooltip
                    title={children}
                    {...slotProps?.tooltip}
                    PopperProps={{
                        anchorEl: rootRef.current,
                        ...slotProps?.tooltip?.PopperProps,
                    }}
                >
                    {content}
                </Tooltip>
            ) : (
                content
            )}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminEllipsisTooltip: Partial<EllipsisTooltipProps>;
    }

    interface ComponentNameToClassKey {
        CometAdminEllipsisTooltip: EllipsisTooltipClassKey;
    }

    interface Components {
        CometAdminEllipsisTooltip?: {
            defaultProps?: ComponentsPropsList["CometAdminEllipsisTooltip"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminEllipsisTooltip"];
        };
    }
}
