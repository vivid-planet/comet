import { Music } from "@comet/admin-icons";
import * as React from "react";
import styled from "styled-components";

const AudioThumbnailWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: solid 1px ${({ theme }) => theme.palette.grey[100]};
`;

const StyledMusicIcon = styled(Music)`
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.palette.primary.main};
`;

export const AudioThumbnail = (): React.ReactElement => {
    return (
        <AudioThumbnailWrapper>
            <StyledMusicIcon />
        </AudioThumbnailWrapper>
    );
};
