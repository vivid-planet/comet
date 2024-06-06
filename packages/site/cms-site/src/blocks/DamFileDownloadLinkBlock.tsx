"use client";
import * as React from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: React.ReactElement;
    title?: string;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, title }: Props) => {
        if (file === undefined) {
            return <>{children}</>;
        }

        if (openFileType === "Download") {
            return React.cloneElement(children, { href: file.fileUrl, title: title });
        } else {
            return React.cloneElement(children, { href: file.fileUrl, target: "_blank", rel: "noreferrer", title: title });
        }
    },
    { label: "DamFileDownloadLink" },
);
