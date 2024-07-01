import * as React from "react";

import { PhoneLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: React.ReactElement;
    title?: string;
}

export const PhoneLinkBlock = ({ data: { phone }, children, title }: PhoneLinkBlockProps) => {
    if (!phone) {
        return children;
    }

    const childProps = {
        href: `tel:${phone}`,
        title,
    };

    return React.cloneElement(children, childProps);
};
