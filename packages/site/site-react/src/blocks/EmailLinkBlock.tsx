<<<<<<< HEAD
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { type AnchorHTMLAttributes, cloneElement, type ReactElement } from "react";
>>>>>>> main

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
<<<<<<< HEAD
        return cloneElement(
            children as ReactElement<Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "title">>,
            { href, title },
        );
=======
        return cloneElement(children, { ...anchorProps, href });
>>>>>>> main
    }

    return (
        <a {...anchorProps} href={href}>
            {children}
        </a>
    );
};
