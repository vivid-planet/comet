import type { StoryContext, StoryFn } from "@storybook/addons";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function dndProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        // TODO: Fix this
        // @ts-ignore
        return <DndProvider backend={HTML5Backend}>{fn()}</DndProvider>;
    };
}
