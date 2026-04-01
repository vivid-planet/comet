import { Fragment } from "react";

import { ErrorHandlerBoundary } from "../../errorHandler/ErrorHandlerBoundary";
import { PreviewSkeleton } from "../../previewskeleton/PreviewSkeleton";
import { type SupportedBlocks } from "./types";

interface Props {
    supportedBlocks: SupportedBlocks;
    data: {
        blocks: Array<{ key: string; type: string; visible: boolean; props: unknown; previewType: "added" | "removed" | null }>;
    };
}

export const BlocksBlock = ({ supportedBlocks, data: { blocks } }: Props) => {
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
                                {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message,react/jsx-no-literals */}
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                Unknown type ({block.type}): {JSON.stringify(block.props)}
                            </pre>
                        );
                    }

                    return null;
                }

                const content = <ErrorHandlerBoundary>{blockFunction(block.props)}</ErrorHandlerBoundary>;

                return (
                    <Fragment key={block.key}>
                        {block.previewType ? (
                            <div
                                style={{
                                    borderLeft: `4px solid ${block.previewType === "added" ? "green" : "red"}`,
                                    backgroundColor: block.previewType === "added" ? "rgba(0, 128, 0, 0.5)" : "rgba(255, 0, 0, 0.5)",
                                }}
                            >
                                {content}
                            </div>
                        ) : (
                            content
                        )}
                    </Fragment>
                );
            })}
        </>
    );
};
