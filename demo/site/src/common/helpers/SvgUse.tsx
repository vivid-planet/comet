import { SVGProps } from "react";

interface SvgUseProps extends SVGProps<SVGSVGElement> {
    href: string;
}

export const SvgUse = ({ href, ...props }: SvgUseProps) => (
    <svg {...props}>
        <use href={href} xlinkHref={href} />
    </svg>
);
