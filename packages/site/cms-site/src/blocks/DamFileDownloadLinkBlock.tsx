"use client";
import * as React from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: React.ReactElement;
    title?: string;
    className?: string;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, title, className }: Props) => {
        if (!file) {
            return <span className={className}>{children}</span>;
        }

        return (
            <a href={file.fileUrl} target={openFileType === "NewTab" ? "_blank" : undefined} title={title} className={className}>
                {children}
            </a>
        );
    },
    { label: "DamFileDownloadLink" },
);
