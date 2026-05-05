import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

type LinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;

const Link = ({ children, href, ...props }: LinkProps) => (
    <a href={href} {...props}>
        {children}
    </a>
);

export default Link;
