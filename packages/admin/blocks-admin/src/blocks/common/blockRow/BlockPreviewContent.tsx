import { Typography } from "@mui/material";
import * as React from "react";

import { useBlockContext } from "../../../context/useBlockContext";
import { BlockInterface, isPreviewContentImageRule, isPreviewContentTextRule } from "../../types";
import * as sc from "./BlockPreviewContent.sc";
import { StackedImages } from "./image/StackedImages";

interface BlockPreviewContentProps {
    title?: React.ReactNode;
    block: BlockInterface;
    state?: unknown;
    input?: unknown;
}

const TEXTS_LIMIT = 2;

export function BlockPreviewContent(props: BlockPreviewContentProps): JSX.Element {
    const context = useBlockContext();
    const state = props.state ? props.state : props.block.input2State(props.input);
    const content = props.block.previewContent(state, context);

    const title = props.title ?? props.block.dynamicDisplayName?.(state) ?? props.block.displayName;

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
