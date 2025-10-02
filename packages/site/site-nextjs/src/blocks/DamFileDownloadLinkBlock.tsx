"use client";

import { type PropsWithData, withPreview } from "@comet/site-react";
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";

import { type DamFileDownloadLinkBlockData } from "../blocks.generated";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: ReactElement<Pick<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "target" | "title">>;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, title, className, legacyBehavior }: Props) => {
        if (!file) {
            if (legacyBehavior) {
                return children;
            }

            return <span className={className}>{children}</span>;
        }

        const href = file.fileUrl;
        const target = openFileType === "NewTab" ? "_blank" : undefined;

        if (legacyBehavior) {
            return cloneElement(children, { href, target, title });
        }

        return (
            <a href={href} target={target} title={title} className={className}>
                {children}
            </a>
        );
    },
    { label: "DamFileDownloadLink" },
);
