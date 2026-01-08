import { type SupportedBlocks } from "@comet/site-nextjs";
import { Fragment } from "react";

interface Props {
    supportedBlocks: SupportedBlocks;
    data: {
        blocks: Array<{ key: string; type: string; visible: boolean; props: unknown }>;
    };
}

export const BlocksBlock = ({ supportedBlocks, data: { blocks } }: Props) => {
    if (blocks.length === 0) {
        return "Preview";
    }

    return (
        <>
            {blocks.map((block) => {
                const blockFunction = supportedBlocks[block.type];

                if (!blockFunction) {
                    if (process.env.NODE_ENV === "development") {
                        return (
                            <pre key={block.key}>
                                {}
                                Unknown type ({block.type}): {JSON.stringify(block.props)}
                            </pre>
                        );
                    }

                    return null;
                }

                return <Fragment key={block.key}>{blockFunction(block.props)}</Fragment>;
            })}
        </>
    );
};
