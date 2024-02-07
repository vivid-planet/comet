import { StoryContext } from "@storybook/react";

declare type AnyFramework = {
    component: unknown;
    storyResult: unknown;
};

type DecoratorStoryFramework<StoryResult = unknown> = Omit<AnyFramework, "storyResult"> & {
    storyResult: StoryResult;
};

export type DecoratorContext<StoryFnReturnType> = StoryContext<DecoratorStoryFramework<StoryFnReturnType>>;
