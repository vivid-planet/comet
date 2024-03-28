// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import * as React from "react";

import { usePreview } from "../preview/usePreview";

export const Link = ({ children, href, ...restProps }: React.ComponentProps<typeof NextLink>): JSX.Element => {
    const { pathToPreviewPath } = usePreview();

    return (
        <NextLink {...restProps} href={pathToPreviewPath(href)}>
            {React.isValidElement<{ title?: string }>(children) ? React.cloneElement(children, { title: restProps.title }) : children}
        </NextLink>
    );
};
