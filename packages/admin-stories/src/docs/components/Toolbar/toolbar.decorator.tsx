import { Stack, StackPage, StackPageTitle, StackSwitch } from "@comet/admin";
import { StoryContext, StoryFn } from "@storybook/addons";
import * as React from "react";

export function toolbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        return (
            <Stack topLevelTitle={"Automatic Title from Stack"}>
                <StackSwitch initialPage="automaticTitle">
                    {/* TODO: Fix this */}
                    {/* @ts-ignore */}
                    <StackPage name={"automaticTitle"}>{fn()}</StackPage>
                    <StackPage name={"automaticTitleDetail"} title={"Automatic Title from Stack - Detail"}>
                        {/* TODO: Fix this */}
                        {/* @ts-ignore */}
                        {fn()}
                    </StackPage>
                    <StackPage name="page-1">
                        {/* TODO: Fix this */}
                        {/* @ts-ignore */}
                        <StackPageTitle title={`page1`}>{fn()} </StackPageTitle>
                    </StackPage>
                    <StackPage name="page-2">
                        {/* TODO: Fix this */}
                        {/* @ts-ignore */}
                        <StackPageTitle title={`page2`}>{fn()} </StackPageTitle>
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    };
}
