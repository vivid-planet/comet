"use client";

import { type AnchorHTMLAttributes, cloneElement, type ReactElement } from "react";

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
            return cloneElement(children as ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>, {
                ...anchorProps,
                href,
                target,
            });
        }

        return (
            <a {...anchorProps} href={href} target={target}>
                {children}
            </a>
        );
    },
    { label: "DamFileDownloadLink" },
);
