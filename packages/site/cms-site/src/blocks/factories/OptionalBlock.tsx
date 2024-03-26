import * as React from "react";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block: (props: any) => React.ReactNode;
    data: {
        visible: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        block?: any;
    };
    children?: React.ReactNode;
}

export const OptionalBlock: React.FC<Props> = ({ block: blockFunction, data: { visible, block }, children }) => {
    if (!visible || !block) {
        return null;
    }

    return <>{blockFunction({ ...block, children })}</>;
};
