import { Stack, StackPage, StackPageTitle, StackSwitch } from "@comet/admin";
import { PartialStoryFn, StoryContext } from "@storybook/addons";
import * as React from "react";

export function toolbarDecorator<StoryFnReturnType = unknown>() {
    return (fn: PartialStoryFn<StoryFnReturnType>, c: StoryContext): React.ReactElement => {
        return (
            <Stack topLevelTitle={"Automatic Title from Stack"}>
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
