import { type Decorator } from "@storybook/react";
import { MainContent } from "@comet/admin";

export enum LayoutOptions {
    Default = "default",
    Padded = "padded",
}

export const LayoutDecorator: Decorator = (fn, context) => {

    const { layout : selectedLayout } = context.globals;

    if(selectedLayout === LayoutOptions.Padded) {
        return <div><MainContent>{fn()}</MainContent></div>
    }

    return fn()
};
