import { SnackbarProvider } from "@comet/admin";
import { StoryContext, StoryFn } from "@storybook/addons";
import * as React from "react";

export function snackbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        // TODO: Fix this
        // @ts-ignore
        return <SnackbarProvider>{fn()}</SnackbarProvider>;
    };
}
