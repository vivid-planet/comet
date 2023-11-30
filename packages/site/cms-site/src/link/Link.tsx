// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";

import { usePreview } from "../preview/usePreview";

export type LinkProps = React.PropsWithChildren<NextLinkProps>;

export const Link = ({ children, href, ...restProps }: LinkProps): JSX.Element => {
    const { pathToPreviewPath } = usePreview();

    return (
        <NextLink {...restProps} href={pathToPreviewPath(href)}>
            {children}
        </NextLink>
    );
};
