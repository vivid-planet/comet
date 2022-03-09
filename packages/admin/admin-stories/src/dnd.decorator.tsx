import type { PartialStoryFn, StoryContext } from "@storybook/addons";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function dndProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: PartialStoryFn<StoryFnReturnType>, c: StoryContext): React.ReactElement => {
        return <DndProvider backend={HTML5Backend}>{fn()}</DndProvider>;
    };
}
