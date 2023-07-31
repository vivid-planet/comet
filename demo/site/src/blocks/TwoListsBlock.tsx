import { ListBlock, PropsWithData, withPreview } from "@comet/cms-site";
import { TwoListsBlockData } from "@src/blocks.generated";

import { HeadlineBlock } from "./HeadlineBlock";

const TwoListsBlock = withPreview(
    ({ data: { list1, list2 } }: PropsWithData<TwoListsBlockData>) => {
        return (
            <>
                <ListBlock data={list1} block={(props) => <HeadlineBlock data={props} />} />
                <hr />
                <ListBlock data={list2} block={(props) => <HeadlineBlock data={props} />} />
            </>
        );
    },
    { label: "Two Lists" },
);

export { TwoListsBlock };
