// eslint-disable-next-line import/no-extraneous-dependencies
import { AnyFramework, StoryContext } from "@storybook/csf/dist/story";

type DecoratorStoryFramework<StoryResult = unknown> = Omit<AnyFramework, "storyResult"> & {
    storyResult: StoryResult;
};

export type DecoratorContext<StoryFnReturnType> = StoryContext<DecoratorStoryFramework<StoryFnReturnType>>;
