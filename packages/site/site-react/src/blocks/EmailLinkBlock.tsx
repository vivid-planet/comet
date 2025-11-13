<<<<<<< HEAD:packages/site/site-nextjs/src/blocks/EmailLinkBlock.tsx
import { type PropsWithData } from "@comet/site-react";
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { cloneElement, type ReactElement } from "react";
>>>>>>> main:packages/site/site-react/src/blocks/EmailLinkBlock.tsx

import { type EmailLinkBlockData } from "../blocks.generated";
import { type PropsWithData } from "./PropsWithData";

interface EmailLinkBlockProps extends PropsWithData<EmailLinkBlockData> {
    children: ReactElement;
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
        return cloneElement(
            children as ReactElement<Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "title">>,
            { href, title },
        );
    }

    return (
        <a href={href} title={title} className={className}>
            {children}
        </a>
    );
};
