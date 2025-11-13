<<<<<<< HEAD:packages/site/site-nextjs/src/blocks/PhoneLinkBlock.tsx
import { type PropsWithData } from "@comet/site-react";
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { cloneElement, type ReactElement } from "react";
>>>>>>> main:packages/site/site-react/src/blocks/PhoneLinkBlock.tsx

import { type PhoneLinkBlockData } from "../blocks.generated";
import { type PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: ReactElement;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export const PhoneLinkBlock = ({ data: { phone }, children, title, className, legacyBehavior }: PhoneLinkBlockProps): React.ReactNode => {
    if (!phone) {
        if (legacyBehavior) {
            return children;
        }

        return <span className={className}>{children}</span>;
    }

    const href = `tel:${phone}`;

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
