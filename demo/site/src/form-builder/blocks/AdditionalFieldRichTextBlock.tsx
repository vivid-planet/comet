import { RichTextBlockData } from "@src/blocks.generated";
import RichTextBlock, { defaultRenderers } from "@src/blocks/RichTextBlock";
import { Renderers } from "redraft";
import styled from "styled-components";

const getFieldTextRenderers = ({ htmlFor }: { htmlFor?: string }): Renderers => ({
    inline: defaultRenderers.inline,
    blocks: {
        unstyled: (children, { keys }) =>
            children.map((child, idx) => (
                <Text key={keys[idx]} htmlFor={htmlFor}>
                    {child}
                </Text>
            )),
    },
    entities: defaultRenderers.entities,
});

export const AdditionalFieldRichTextBlock = ({ data, htmlFor }: { data: RichTextBlockData; htmlFor?: string }) => {
    return <RichTextBlock data={data} renderers={getFieldTextRenderers({ htmlFor })} />;
};

const Text = styled.label`
    font-size: 14px;
    line-height: 16px;
    color: gray;
`;
