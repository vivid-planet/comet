import { ErrorDialogHandler } from "@comet/admin";
import { LegacyStoryFn } from "@storybook/addons";
import * as React from "react";

import { DecoratorContext } from "../../../../storyHelpers";

export function errorDialogStoryProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
        return (
            <>
                <ErrorDialogHandler />
                {fn(c)}
            </>
        );
    };
}
