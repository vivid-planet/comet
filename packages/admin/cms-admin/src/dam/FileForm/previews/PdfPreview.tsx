import { styled } from "@mui/material/styles";
import React from "react";

import { GQLDamFileDetailFragment } from "../../../graphql.generated";

const PdfPreviewWrapper = styled("div")`
    width: 100%;
    height: calc(100vh - 300px);
    overflow-y: auto;
`;

const PdfPreviewIFrame = styled("iframe")`
    width: inherit;
    height: inherit;
`;

interface PdfPreviewProps {
    file: GQLDamFileDetailFragment;
    onError?: (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => void;
}

export const PdfPreview = ({ file, onError }: PdfPreviewProps): React.ReactElement => {
    return (
        <PdfPreviewWrapper>
            <PdfPreviewIFrame src={file.fileUrl} onError={onError} />
        </PdfPreviewWrapper>
    );
};
