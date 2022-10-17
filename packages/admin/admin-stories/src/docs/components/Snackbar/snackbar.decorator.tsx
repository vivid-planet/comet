import { SnackbarProvider } from "@comet/admin";
import { LegacyStoryFn } from "@storybook/addons";
import * as React from "react";

import { DecoratorContext } from "../../../storyHelpers";

export function snackbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
        return <SnackbarProvider>{fn(c)}</SnackbarProvider>;
    };
}
