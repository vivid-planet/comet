import { Music } from "@comet/admin-icons";
import React from "react";
import styled from "styled-components";

import { GQLDamFileDetailFragment } from "../../../graphql.generated";

const AudioPreviewWrapper = styled.div`
    width: 100%;
    min-height: 200px;
    background-color: ${({ theme }) => theme.palette.grey[50]};
    display: flex;
    flex-direction: column;
`;

const MusicIconContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MusicIconWrapper = styled.div`
    width: 96px;
    height: 96px;
    background: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
`;

const StyledMusicIcon = styled(Music)`
    width: 27px;
    height: 27px;
    color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledAudio = styled.audio`
    width: inherit;
`;

interface AudioPreviewProps {
    file: GQLDamFileDetailFragment;
}

export const AudioPreview = ({ file }: AudioPreviewProps): React.ReactElement => {
    return (
        <AudioPreviewWrapper>
            <MusicIconContainer>
                <MusicIconWrapper>
                    <StyledMusicIcon />
                </MusicIconWrapper>
            </MusicIconContainer>
            <StyledAudio controls>
                <source src={file.fileUrl} type={file.mimetype} />
            </StyledAudio>
        </AudioPreviewWrapper>
    );
};
