import { Typography } from "@mui/material";
import * as React from "react";

import { isPreviewContentImageRule, isPreviewContentTextRule, PreviewContent } from "../../types";
import * as sc from "./BlockPreview.sc";
import { StackedImages } from "./image/StackedImages";
interface BlockPreviewProps {
    title: React.ReactNode;
    content: PreviewContent[];
}

const TEXTS_LIMIT = 2;

export function BlockPreview({ content, title }: BlockPreviewProps): JSX.Element {
    const texts = content
        .filter(isPreviewContentTextRule)
        .filter(({ content }) => {
            return content !== "";
        })
        .map(({ content }) => {
            return content;
        })
        .slice(0, TEXTS_LIMIT);
    const images = content.filter(isPreviewContentImageRule);

    return (
        <sc.Root>
            {images.length > 0 && (
                <sc.ImageContainer>
                    <StackedImages images={images} />
                </sc.ImageContainer>
            )}

            <sc.TextContainer>
                <sc.TextInnerContainer>
                    <Typography variant="body1" noWrap>
                        {title}
                    </Typography>

                    {texts.map((text, index) => {
                        return (
                            <Typography variant="body2" color="textSecondary" noWrap key={index}>
                                {text}
                            </Typography>
                        );
                    })}
                </sc.TextInnerContainer>
            </sc.TextContainer>
        </sc.Root>
    );
}
