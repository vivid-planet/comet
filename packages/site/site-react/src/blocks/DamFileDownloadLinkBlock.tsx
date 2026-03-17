"use client";

<<<<<<< HEAD
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { type AnchorHTMLAttributes, cloneElement, type ReactElement } from "react";
>>>>>>> main

import { type DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { type PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    children: ReactElement;
    legacyBehavior?: boolean;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, legacyBehavior, ...anchorProps }: Props) => {
        if (!file) {
            if (legacyBehavior) {
                return children;
            }

            return <span className={anchorProps.className}>{children}</span>;
        }

        const href = file.fileUrl;
        const target = openFileType === "NewTab" ? "_blank" : anchorProps.target;

        if (legacyBehavior) {
<<<<<<< HEAD
            return cloneElement(children as ReactElement<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>, {
                href,
                target,
                title,
            });
=======
            return cloneElement(children, { ...anchorProps, href, target });
>>>>>>> main
        }

        return (
            <a {...anchorProps} href={href} target={target}>
                {children}
            </a>
        );
    },
    { label: "DamFileDownloadLink" },
);
