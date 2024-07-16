"use client";
import * as React from "react";
import { ErrorInfo } from "react";
import styled from "styled-components";

import { PreviewSkeleton } from "../../previewskeleton/PreviewSkeleton";
import { ErrorBoundary } from "../helpers/ErrorBoundary";
import { SupportedBlocks } from "./types";

interface Props {
    supportedBlocks: SupportedBlocks;
    data: {
        blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
    };
    onError: (error: Error, errorInfo: ErrorInfo) => void;
}

export const BlocksBlock: React.FC<Props> = ({ supportedBlocks, data: { blocks }, onError }: Props) => {
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
                        <ErrorBoundary
                            blockType={block.type}
                            fallback={process.env.NODE_ENV === "production" ? null : <ErrorFallback blockType={block.type} />}
                            onError={onError}
                        >
                            {blockFunction(block.props)}
                        </ErrorBoundary>
                    </React.Fragment>
                );
            })}
        </>
    );
};

function ErrorFallback({ blockType }: { blockType: string }) {
    return <ErrorRoot>The following Block failed to render: {blockType}</ErrorRoot>;
}

const ErrorRoot = styled.div`
    background-color: red;
    color: white;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
