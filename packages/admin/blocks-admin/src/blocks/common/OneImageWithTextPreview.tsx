import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { isPreviewContentImageRule, isPreviewContentTextRule, PreviewContent, PreviewImage } from "../types";

// @TODO: Probably remove this preview-system, because BlockPreview is used everywhere now

export function OneImageWithTextPreview({ content }: { content: PreviewContent[] }): JSX.Element | null {
    const text = content.filter(isPreviewContentTextRule).map(({ content }) => {
        return content;
    });
    const images = content.filter(isPreviewContentImageRule).map(({ content }) => {
        return content;
    });

    if (text.length && images.length) {
        return <TextAndImage text={text[0]} image={images[0]} />;
    } else if (text.length) {
        return <Text text={text[0]} />;
    } else if (images.length) {
        if (images.length > 1) {
            return <Images images={[...images.slice(0, 3)]} />; // 3 images are probably enough
        } else {
            return <Image image={images[0]} />;
        }
    } else {
        return null;
    }
}

function TextAndImage({ text, image }: { text: React.ReactNode; image: PreviewImage }): JSX.Element {
    return (
        <div style={{ display: "flex" }}>
            <div>
                <ImageTag src={image.src} />
            </div>
            <div>
                <Typography noWrap={false}>{text}</Typography>
            </div>
        </div>
    );
}
const ImageTag = styled("img")`
    object-fit: cover;
    width: 64px;
    height: 64px;
    margin-right: 12px;
`;

function Text({ text }: { text: React.ReactNode }): JSX.Element {
    return <>{text}</>;
}

function Image({ image }: { image: PreviewImage }): JSX.Element {
    return (
        <div>
            <ImageTag src={image.src} />
        </div>
    );
}

function Images({ images }: { images: PreviewImage[] }): JSX.Element {
    return (
        <div>
            {images.map((c, idx) => (
                <ImageTag key={idx} src={c.src} />
            ))}
        </div>
    );
}
