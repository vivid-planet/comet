import { Stack, StackPage, StackPageTitle, StackSwitch } from "@comet/admin";
import { LegacyStoryFn } from "@storybook/addons";
import * as React from "react";

import { DecoratorContext } from "../../../storyHelpers";

export function toolbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
        return (
            <Stack topLevelTitle="Automatic Title from Stack">
                <StackSwitch initialPage="automaticTitle">
                    <StackPage name="automaticTitle">{fn(c)}</StackPage>
                    <StackPage name="automaticTitleDetail" title="Automatic Title from Stack - Detail">
                        {fn(c)}
                    </StackPage>
                    <StackPage name="page-1">
                        <StackPageTitle title="page1">{fn(c)} </StackPageTitle>
                    </StackPage>
                    <StackPage name="page-2">
                        <StackPageTitle title="page2">{fn(c)} </StackPageTitle>
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    };
}
