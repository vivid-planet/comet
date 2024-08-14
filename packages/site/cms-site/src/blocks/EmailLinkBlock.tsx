import * as React from "react";

import { EmailLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface EmailLinkBlockProps extends PropsWithData<EmailLinkBlockData> {
    children: React.ReactElement;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export const EmailLinkBlock = ({ data: { email }, children, title, className, legacyBehavior }: EmailLinkBlockProps) => {
    if (!email) {
        if (legacyBehavior) {
            return children;
        }

        return <span className={className}>{children}</span>;
    }

    const href = `mailto:${email}`;

    if (legacyBehavior) {
        return React.cloneElement(children, { href, title });
    }

    return (
        <a href={href} title={title} className={className}>
            {children}
        </a>
    );
};
