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
        if (!file) {
            return children;
        }

        const childProps = {
            href: file.fileUrl,
            title,
            ...(openFileType !== "Download" && { target: "_blank" }),
        };

        return React.cloneElement(children, childProps);
    },
    { label: "DamFileDownloadLink" },
);
