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

        const handleClick = (event: React.MouseEvent) => {
            event.preventDefault();

            if (openFileType === OpenFileTypeMethod.DOWNLOAD) {
                saveAs(file.fileUrl, file.name);
            } else if (openFileType === OpenFileTypeMethod.NEW_TAB) {
                window.open(file.fileUrl);
            }
        };

        return React.cloneElement(children, {
            href: "#",
            onClick: handleClick,
            title,
        });
    },
    { label: "DamFileDownloadLink" },
);
