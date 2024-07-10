import * as React from "react";

import { PhoneLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: React.ReactElement;
    title?: string;
    className?: string;
}

export const PhoneLinkBlock = ({ data: { phone }, children, title, className }: PhoneLinkBlockProps) => {
    if (!phone) {
        return <span className={className}>{children}</span>;
    }

    return (
        <a href={`tel:${phone}`} title={title} className={className}>
            {children}
        </a>
    );
};
