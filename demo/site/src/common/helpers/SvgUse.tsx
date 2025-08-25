"use client";
import { type SVGProps } from "react";

interface SvgUseProps extends SVGProps<SVGSVGElement> {
    href: string;
    title?: string;
    ariaHidden?: boolean;
}

export const SvgUse = ({ href, title, ariaHidden = true, ...props }: SvgUseProps) => (
    <svg aria-hidden={ariaHidden} {...props}>
        <use href={href} xlinkHref={href} />
        <title>{title}</title>
    </svg>
);
