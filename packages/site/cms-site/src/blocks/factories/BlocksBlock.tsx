"use client";
import * as React from "react";

import { ErrorHandlerBoundary } from "../../errorHandler/ErrorHandlerBoundary";
import { useErrorHandler } from "../../errorHandler/ErrorHandlerProvider";
import { PreviewSkeleton } from "../../previewskeleton/PreviewSkeleton";
import { SupportedBlocks } from "./types";

interface Props {
    supportedBlocks: SupportedBlocks;
    data: {
        blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
    };
}

export const BlocksBlock: React.FC<Props> = ({ supportedBlocks, data: { blocks } }: Props) => {
    const { onError } = useErrorHandler();

    if (blocks.length === 0) {
        return <PreviewSkeleton hasContent={false} />;
    }

    return (
        <>
            {blocks.map((block) => {
                const blockFunction = supportedBlocks[block.type];

                if (!blockFunction) {
                    if (process.env.NODE_ENV === "development") {
                        return (
                            <pre key={block.key}>
                                Unknown type ({block.type}): {JSON.stringify(block.props)}
                            </pre>
                        );
                    }

                    return null;
                }
                return (
                    <React.Fragment key={block.key}>
                        <ErrorHandlerBoundary onError={onError}>{blockFunction(block.props)}</ErrorHandlerBoundary>
                    </React.Fragment>
                );
            })}
        </>
    );
};
