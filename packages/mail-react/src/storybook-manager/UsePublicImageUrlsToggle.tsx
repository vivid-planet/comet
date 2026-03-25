import React, { useCallback } from "react";
import { IconButton, TooltipNote, WithTooltip } from "storybook/internal/components";
import { useGlobals } from "storybook/manager-api";

export function UsePublicImageUrlsToggle() {
    const [globals, updateGlobals] = useGlobals();
    const isActive = globals["usePublicImageUrls"] === true;

    const handleToggle = useCallback(() => {
        updateGlobals({ usePublicImageUrls: !isActive });
    }, [isActive, updateGlobals]);

    return (
        <WithTooltip
            tooltip={<TooltipNote note="Helpful to test with real images on external devices that cannot access localhost, e.g. Email on Acid." />}
            trigger="hover"
        >
            <IconButton onClick={handleToggle} active={isActive} ariaLabel="Use public image URLs">
                <input type="checkbox" checked={isActive} readOnly style={{ pointerEvents: "none", margin: 0 }} />
                &nbsp;Use public image URLs ℹ️
            </IconButton>
        </WithTooltip>
    );
}
