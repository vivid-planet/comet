import { saveAs } from "file-saver";
import * as React from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: React.ReactElement;
    title?: string;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, tracking }, children, title }: Props) => {
        if (file === undefined) {
            return children;
        }

        const handleClick = (event: React.MouseEvent) => {
            event.preventDefault();

            saveAs(file.fileUrl, file.name);
        };

        return React.cloneElement(children, {
            href: "#",
            onClick: handleClick,
            title,
            "data-gtm-element": "download",
            "data-gtm-element-type": tracking?.gtmElementType ?? "Download",
            "data-gtm-element-name": tracking?.gtmElementName ?? file.name,
            "data-gtm-element-url": file.fileUrl,
            "data-gtm-element-size": file.size,
        });
    },
    { label: "DamFileDownloadLink" },
);
