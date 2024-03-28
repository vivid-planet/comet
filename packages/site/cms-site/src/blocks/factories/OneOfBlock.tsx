import * as React from "react";

import { SupportedBlocks } from "./types";

interface Props {
    data: {
        block?: {
            type: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props: any;
        };
    };
    supportedBlocks: SupportedBlocks;
    children?: React.ReactNode;
}

export const OneOfBlock: React.FC<Props> = ({ data: { block, ...additionalProps }, supportedBlocks, children }) => {
    if (!block) {
        return null;
    }

    const blockFunction = supportedBlocks[block.type];

    if (!blockFunction) {
        if (process.env.NODE_ENV === "development") {
            return (
                <pre>
                    Unknown type ({block.type}): {JSON.stringify(block.props)}
                </pre>
            );
        }

        return null;
    }

    return <>{blockFunction({ ...block.props, ...additionalProps, children })}</>;
};
