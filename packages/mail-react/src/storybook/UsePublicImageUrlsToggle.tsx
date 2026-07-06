/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from "react";
import { IconButton, TooltipNote, WithTooltip } from "storybook/internal/components";
import { useGlobals } from "storybook/manager-api";

export function UsePublicImageUrlsToggle() {
    const [globals, updateGlobals] = useGlobals();
    const isActive = Boolean(globals.usePublicImageUrls);

    return (
        <WithTooltip
            tooltip={<TooltipNote note="Helpful to test with real images on external devices that cannot access localhost, e.g. Email on Acid." />}
            trigger="hover"
        >
            <IconButton size="small" active={isActive} onClick={() => updateGlobals({ usePublicImageUrls: !isActive })}>
                <input type="checkbox" checked={isActive} readOnly style={{ pointerEvents: "none", marginLeft: 4 }} />
                Use public image URLs
                <span role="img" aria-label="info">
                    ℹ️
                </span>
            </IconButton>
        </WithTooltip>
    );
}
