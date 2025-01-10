import { PropsWithData } from "@comet/cms-site";
import { ColumnsBlockData } from "@src/blocks.generated";

import { Root } from "./ColumnsBlock.sc";
import { ColumnsContentBlock } from "./ColumnsContentBlock";

export const ColumnsBlock = ({ data: { layout, columns } }: PropsWithData<ColumnsBlockData>) => {
    return (
        <Root layout={layout}>
            {columns.map((column) => (
                <ColumnsContentBlock key={column.key} data={column.props} />
            ))}
        </Root>
    );
};
//export default withPreview(ColumnsBlock, { label: "Columns" });
