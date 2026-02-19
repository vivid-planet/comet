import { cloneElement, type ReactElement } from "react";

import { type PhoneLinkBlockData } from "../blocks.generated";
import { type PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: ReactElement;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export const PhoneLinkBlock = ({ data: { phone }, children, title, className, legacyBehavior }: PhoneLinkBlockProps) => {
    if (!phone) {
        if (legacyBehavior) {
            return children;
        }

        return <span className={className}>{children}</span>;
    }

    const href = `tel:${phone}`;

    if (legacyBehavior) {
        return cloneElement(children, { href, title });
    }

    return (
        <a href={href} title={title} className={className}>
            {children}
        </a>
    );
};
