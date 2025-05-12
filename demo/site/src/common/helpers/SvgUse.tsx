"use client";
import { SVGProps } from "react";

interface SvgUseProps extends SVGProps<SVGSVGElement> {
    href: string;
}

export const SvgUse = ({ href, ...props }: SvgUseProps) => (
    <svg aria-hidden="true" {...props}>
        <use href={href} xlinkHref={href} />
    </svg>
);
