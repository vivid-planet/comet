import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type MultipleOptionsBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

export const MulitpleOptionsBlock = withPreview(
    ({ data: { options } }: PropsWithData<MultipleOptionsBlockData>) => {
        return <PageLayout grid>{options[0]}</PageLayout>;
    },
    {
        label: "MultipleOptions",
    },
);
