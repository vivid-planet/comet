import * as React from "react";

import { ErrorHandlerBoundary } from "../../errorHandler/ErrorHandlerBoundary";
import { useErrorHandler } from "../../errorHandler/ErrorHandlerProvider";
import { PreviewSkeleton } from "../../previewskeleton/PreviewSkeleton";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block: (props: any) => React.ReactNode;
    data: {
        blocks: Array<{ key: string; visible: boolean; props: unknown }>;
    };
}

export const ListBlock: React.FC<Props> = ({ block: blockFunction, data: { blocks } }: Props) => {
    const { onError } = useErrorHandler();

    if (blocks.length === 0) {
        return <PreviewSkeleton hasContent={false} />;
    }

    return (
        <>
            {blocks.map((block) => (
                <React.Fragment key={block.key}>
                    <ErrorHandlerBoundary onError={onError}>{blockFunction(block.props)}</ErrorHandlerBoundary>
                </React.Fragment>
            ))}
        </>
    );
};
