import { type AnchorHTMLAttributes, cloneElement, type ReactElement } from "react";

import { type EmailLinkBlockData } from "../blocks.generated";
import { type PropsWithData } from "./PropsWithData";

interface EmailLinkBlockProps extends PropsWithData<EmailLinkBlockData>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    children: ReactElement;
    legacyBehavior?: boolean;
}

export const EmailLinkBlock = ({ data: { email }, children, legacyBehavior, ...anchorProps }: EmailLinkBlockProps) => {
    if (!email) {
        if (legacyBehavior) {
            return children;
        }

        return <span className={anchorProps.className}>{children}</span>;
    }

    const href = `mailto:${email}`;

    if (legacyBehavior) {
        return cloneElement(children, { ...anchorProps, href });
    }

    return (
        <a {...anchorProps} href={href}>
            {children}
        </a>
    );
};
