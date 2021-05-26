import { ErrorDialogProvider } from "@comet/admin";
import { StoryContext, StoryFn } from "@storybook/addons/dist/types";
import * as React from "react";

export function errorDialogStoryProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        return <ErrorDialogProvider>{fn()}</ErrorDialogProvider>;
    };
}
