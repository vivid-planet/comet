import { saveAs } from "file-saver";
import * as React from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: React.ReactElement;
    title?: string;
}

enum OpenFileTypeMethod {
    NEW_TAB = "NEW_TAB",
    DOWNLOAD = "DOWNLOAD",
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, title }: Props) => {
        if (file === undefined) {
            return children;
        }

        if (openFileType === OpenFileTypeMethod.DOWNLOAD) {
            return React.cloneElement(children, {
                href: "#",
                onClick: () => saveAs(file.fileUrl, file.name),
                title,
            });
        } else if (openFileType === OpenFileTypeMethod.NEW_TAB) {
            return React.cloneElement(
                <a href={file.fileUrl} target="_blank" rel="noreferrer">
                    {children}
                </a>,
                { title },
            );
        }

        return children;
    },
    { label: "DamFileDownloadLink" },
);
