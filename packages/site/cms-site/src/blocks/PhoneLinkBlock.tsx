import * as React from "react";

import { PhoneLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: React.ReactElement;
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
        return React.cloneElement(children, { href, title });
    }

    return (
        <a href={href} title={title} className={className}>
            {children}
        </a>
    );
};
