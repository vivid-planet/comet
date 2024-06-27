import * as React from "react";

import { EmailLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface EmailLinkBlockProps extends PropsWithData<EmailLinkBlockData> {
    children: React.ReactElement;
    title?: string;
}

export const EmailLinkBlock = ({ data: { email }, children, title }: EmailLinkBlockProps) => {
    if (!email) {
        return children;
    }

    const childProps = {
        href: `mailto:${email}`,
        title,
    };

    return React.cloneElement(children, childProps);
};
