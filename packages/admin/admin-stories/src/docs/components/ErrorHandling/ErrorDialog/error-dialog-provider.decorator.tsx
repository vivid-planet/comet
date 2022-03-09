import { ErrorDialogProvider } from "@comet/admin";
import type { PartialStoryFn, StoryContext } from "@storybook/addons";
import * as React from "react";

export function errorDialogStoryProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: PartialStoryFn<StoryFnReturnType>, c: StoryContext): React.ReactElement => {
        return <ErrorDialogProvider>{fn()}</ErrorDialogProvider>;
    };
}
