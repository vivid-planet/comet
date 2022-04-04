import { LegacyStoryFn } from "@storybook/addons";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DecoratorContext } from "./storyHelpers";

export function dndProviderDecorator<StoryFnReturnType = unknown>() {
    return (fn: LegacyStoryFn<StoryFnReturnType>, c: DecoratorContext<StoryFnReturnType>) => {
        return <DndProvider backend={HTML5Backend}>{fn(c)}</DndProvider>;
    };
}
