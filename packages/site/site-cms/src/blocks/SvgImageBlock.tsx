import * as React from "react";

import { SvgImageBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { PropsWithData } from "./PropsWithData";

type SvgImageBlockProps = PropsWithData<SvgImageBlockData>;
export const SvgImageBlock = withPreview(
    ({ data: { damFile } }: SvgImageBlockProps) => {
        if (!damFile) return <PreviewSkeleton type="media" hasContent={false} />;
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={damFile.fileUrl} width="100%" height="100%" alt={damFile.altText} />;
    },
    { label: "SvgImage" },
);
