import { SnackbarProvider } from "@comet/admin";
import { PartialStoryFn, StoryContext } from "@storybook/addons";
import * as React from "react";

export function snackbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: PartialStoryFn<StoryFnReturnType>, c: StoryContext): React.ReactElement => {
        return <SnackbarProvider>{fn()}</SnackbarProvider>;
    };
}
