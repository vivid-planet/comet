"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { PropsWithChildren } from "react";

/** @experimental */
export interface TooltipProviderProps extends PropsWithChildren {
    /**
     * How long the pointer has to rest on a trigger before its tooltip opens, in milliseconds, for the tooltips
     * inside that don't set their own `delay`.
     *
     * @defaultValue `600`
     */
    delay?: number;
    /**
     * How long a tooltip stays open after the pointer leaves its trigger, in milliseconds.
     *
     * @defaultValue `0`
     */
    closeDelay?: number;
    /**
     * How long after a tooltip closes the next one still opens without a delay, in milliseconds.
     *
     * @defaultValue `400`
     */
    timeout?: number;
}

/**
 * Groups the tooltips inside it, such as those of a toolbar's icon buttons: once one tooltip has opened, the
 * pointer can move to the next trigger and its tooltip opens right away, without waiting for the delay again.
 * It also sets a common delay for the tooltips inside.
 *
 * Wrap a group of triggers that sit next to each other, or the whole application. It renders no element.
 *
 * @summary Opens adjacent tooltips without a delay and sets their common delay.
 * @experimental
 */
export function TooltipProvider({ delay, closeDelay, timeout, children }: TooltipProviderProps) {
    return (
        <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
            {children}
        </BaseTooltip.Provider>
    );
}
