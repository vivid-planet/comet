"use client";
import { type SVGProps } from "react";

interface SvgUseProps extends SVGProps<SVGSVGElement> {
    href: string;
    title?: string;
}

export const SvgUse = ({ title, href, ...props }: SvgUseProps) => (
    <svg aria-hidden={title ? undefined : true} {...props}>
        {title && <title>{title}</title>}
        <use href={href} xlinkHref={href} />
    </svg>
);
