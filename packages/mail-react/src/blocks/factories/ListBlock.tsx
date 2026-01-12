import { Fragment, type ReactNode } from "react";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block: (props: any) => ReactNode;
    data: {
        blocks: Array<{ key: string; visible: boolean; props: unknown }>;
    };
}

export const ListBlock = ({ block: blockFunction, data: { blocks } }: Props) => {
    return (
        <>
            {blocks.map((block) => (
                <Fragment key={block.key}>{blockFunction(block.props)}</Fragment>
            ))}
        </>
    );
};
