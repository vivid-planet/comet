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
    ({ data: { file, openFileType }, children, title }: Props) => {
        if (file === undefined) {
            return children;
        }

        if (openFileType === "DOWNLOAD") {
            return React.cloneElement(children, {
                href: "#",
                onClick: () => saveAs(file.fileUrl, file.name),
                title,
            });
        } else if (openFileType === "NEW_TAB") {
            return (
                <a href={file.fileUrl} target="_blank" rel="noreferrer">
                    {children}
                </a>
            );
        }

        return children;
    },
    { label: "DamFileDownloadLink" },
);
