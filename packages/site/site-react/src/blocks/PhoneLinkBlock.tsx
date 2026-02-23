<<<<<<< HEAD
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { type AnchorHTMLAttributes, cloneElement, type ReactElement } from "react";
>>>>>>> main

import { type PhoneLinkBlockData } from "../blocks.generated";
import { type PropsWithData } from "./PropsWithData";

interface PhoneLinkBlockProps extends PropsWithData<PhoneLinkBlockData>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    children: ReactElement;
    legacyBehavior?: boolean;
}

<<<<<<< HEAD
export const PhoneLinkBlock = ({ data: { phone }, children, title, className, legacyBehavior }: PhoneLinkBlockProps): React.ReactNode => {
=======
export const PhoneLinkBlock = ({ data: { phone }, children, legacyBehavior, ...anchorProps }: PhoneLinkBlockProps) => {
>>>>>>> main
    if (!phone) {
        if (legacyBehavior) {
            return children;
        }

        return <span className={anchorProps.className}>{children}</span>;
    }

    const href = `tel:${phone}`;

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
