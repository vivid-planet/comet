import clsx from "clsx";
import { type ComponentPropsWithoutRef, forwardRef, type PropsWithChildren } from "react";

export interface IconProps extends Omit<ComponentPropsWithoutRef<"svg">, "children"> {
    /** Added alongside the icon's own class. */
    className?: string;
    /** Names the icon for assistive technology; without it the icon is hidden from it. */
    "aria-label"?: string;
}

export const IconBase = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(function IconBase(
    { className, children, "aria-label": ariaLabel, ...restProps },
    ref,
) {
    const isLabeled = ariaLabel !== undefined;
    return (
        <svg
            viewBox="0 0 16 16"
            width={16}
            height={16}
            fill="none"
            focusable="false"
            aria-hidden={isLabeled ? undefined : true}
            role={isLabeled ? "img" : undefined}
            aria-label={ariaLabel}
            {...restProps}
            className={clsx("dextinityIcon", className)}
            ref={ref}
        >
            {children}
        </svg>
    );
});
