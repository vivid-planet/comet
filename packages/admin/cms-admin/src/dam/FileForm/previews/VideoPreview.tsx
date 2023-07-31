import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { DamFileDetails } from "../EditFile";

const VideoPreviewWrapper = styled("div")`
    width: 100%;
    max-width: 60vw;
    min-height: 200px;
    background-color: ${({ theme }) => theme.palette.grey[50]};
    display: flex;
    flex-direction: column;
`;

const StyledVideo = styled("video")`
    width: 100%;
`;

interface VideoPreviewProps {
    file: DamFileDetails;
}

export const VideoPreview = ({ file }: VideoPreviewProps): React.ReactElement => {
    return (
        <VideoPreviewWrapper>
            <StyledVideo controls src={file.fileUrl}>
                <FormattedMessage
                    id="comet.dam.file.unsupportedVideoTag"
                    defaultMessage="Your browser does not support the video element. Please use another browser."
                />
            </StyledVideo>
        </VideoPreviewWrapper>
    );
};
