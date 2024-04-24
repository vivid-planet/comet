import * as React from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PropsWithData } from "./PropsWithData";

interface Props extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: React.ReactNode;
    title?: string;
}

export const DamFileDownloadLinkBlock = withPreview(
    ({ data: { file, openFileType }, children, title }: Props) => {
        if (file === undefined) {
            return <>{children}</>;
        }

        if (openFileType === "Download") {
            return (
                <a href={file.fileUrl} title={title}>
                    {children}
                </a>
            );
        } else {
            return (
                <a href={file.fileUrl} target="_blank" rel="noreferrer" title={title}>
                    {children}
                </a>
            );
        }
    },
    { label: "DamFileDownloadLink" },
);
