import { DamImageBlockData } from "@src/blocks.generated";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { SvgUse } from "@src/blocks/helpers/SvgUse";
import { useIntl } from "react-intl";
import styled from "styled-components";

interface VideoPreviewImageProps {
    onClick: () => void;
    image: DamImageBlockData;
    aspectRatio?: string;
    sizes?: string;
}

export const VideoPreviewImage = ({ onClick, image, aspectRatio, sizes = "100vw" }: VideoPreviewImageProps) => {
    const intl = useIntl();
    return (
        <Root onClick={onClick} aria-label={intl.formatMessage({ id: "videoPreviewImage.ariaLabel.startVideo", defaultMessage: "Start video" })}>
            <DamImageBlock
                data={image}
                aspectRatio={aspectRatio ? aspectRatio : "16x9"}
                layout={aspectRatio ? "responsive" : "intrinsic"}
                sizes={sizes}
            />
            <IconWrapper>
                <PlayIcon href="/icons/play-circle.svg#play-circle" />
            </IconWrapper>
        </Root>
    );
};

const Root = styled.button`
    position: relative;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
`;

const IconWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    opacity: 0.5;
`;

const PlayIcon = styled(SvgUse)`
    width: 64px;
    height: 64px;
`;
