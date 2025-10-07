import { type PropsWithData } from "@comet/site-react";
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";

import { type PhoneLinkBlockData } from "../blocks.generated";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData> {
    children: ReactElement<Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "title">>;
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
        return cloneElement(children, { href, title });
    }

    return (
        <a href={href} title={title} className={className}>
            {children}
        </a>
    );
};
