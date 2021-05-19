import { Stack, StackPage, StackPageTitle, StackSwitch } from "@comet/admin";
import { StoryContext, StoryFn } from "@storybook/addons";
import * as React from "react";

export function toolbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        return (
            <Stack topLevelTitle={"Automatic Title from Stack"} showBackButton={false}>
                <StackSwitch initialPage="automaticTitle">
                    <StackPage name={"automaticTitle"}>{fn()}</StackPage>
                    <StackPage name={"automaticTitleDetail"} title={"Automatic Title from Stack - Detail"}>
                        {fn()}
                    </StackPage>
                    <StackPage name="page-1">
                        <StackPageTitle title={`page1`}>{fn()} </StackPageTitle>
                    </StackPage>
                    <StackPage name="page-2">
                        <StackPageTitle title={`page2`}>{fn()} </StackPageTitle>
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    };
}
