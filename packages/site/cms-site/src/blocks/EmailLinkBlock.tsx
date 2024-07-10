import * as React from "react";

import { EmailLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface EmailLinkBlockProps extends PropsWithData<EmailLinkBlockData> {
    children: React.ReactElement;
    title?: string;
    className?: string;
}

export const EmailLinkBlock = ({ data: { email }, children, title, className }: EmailLinkBlockProps) => {
    if (!email) {
        return <span className={className}>{children}</span>;
    }

    return (
        <a href={`mailto:${email}`} title={title} className={className}>
            {children}
        </a>
    );
};
