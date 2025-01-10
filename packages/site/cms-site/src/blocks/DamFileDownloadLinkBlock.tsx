import { cloneElement, ReactElement } from "react";

import { DamFileDownloadLinkBlockData } from "../blocks.generated";
import { PropsWithData } from "./PropsWithData";

interface DamFileDownloadLinkBlockProps extends PropsWithData<DamFileDownloadLinkBlockData> {
    children: ReactElement;
    title?: string;
    className?: string;
    legacyBehavior?: boolean;
}

export const DamFileDownloadLinkBlock = ({
    data: { file, openFileType },
    children,
    title,
    className,
    legacyBehavior,
}: DamFileDownloadLinkBlockProps) => {
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
};

//export default withPreview(DamFileDownloadLinkBlock, { label: "DamFileDownloadLink" });
