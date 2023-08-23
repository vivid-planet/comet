// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";

export type LinkProps = React.PropsWithChildren<NextLinkProps>;

export const Link = ({ children, href, ...restProps }: LinkProps): JSX.Element => {
    return (
        <NextLink {...restProps} href={href}>
            {children}
        </NextLink>
    );
};
