import * as React from "react";
import { ErrorInfo } from "react";

import { PreviewSkeleton } from "../../previewskeleton/PreviewSkeleton";
import { ErrorBoundary } from "../helpers/ErrorBoundary";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block: (props: any) => React.ReactNode;
    data: {
        blocks: Array<{ key: string; visible: boolean; props: unknown }>;
    };
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const ListBlock: React.FC<Props> = ({ block: blockFunction, data: { blocks }, onError }: Props) => {
    if (blocks.length === 0) {
        return <PreviewSkeleton hasContent={false} />;
    }

    return (
        <>
            {blocks.map((block) => (
                <React.Fragment key={block.key}>
                    <ErrorBoundary
                        onError={(error, errorInfo) => {
                            if (onError) {
                                onError(error, errorInfo);
                            } else {
                                if (process.env.NODE_ENV === "development") {
                                    throw error;
                                }
                            }
                        }}
                    >
                        {blockFunction(block.props)}
                    </ErrorBoundary>
                </React.Fragment>
            ))}
        </>
    );
};
