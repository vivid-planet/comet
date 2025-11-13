"use client";

<<<<<<< HEAD:packages/site/site-nextjs/src/blocks/DamFileDownloadLinkBlock.tsx
import { type PropsWithData, withPreview } from "@comet/site-react";
import { type AnchorHTMLAttributes, cloneElement, type DetailedHTMLProps, type ReactElement } from "react";
=======
import { cloneElement, type ReactElement } from "react";
>>>>>>> main:packages/site/site-react/src/blocks/DamFileDownloadLinkBlock.tsx

import { type DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { type PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: ReactElement;
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
            return cloneElement(children as ReactElement<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>, {
                href,
                target,
                title,
            });
        }

        return (
            <a href={href} target={target} title={title} className={className}>
                {children}
            </a>
        );
    },
    { label: "DamFileDownloadLink" },
);
