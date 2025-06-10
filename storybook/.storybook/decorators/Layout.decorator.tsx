import { MainContent } from "@comet/admin";
import { useTheme } from "@mui/material";
import { GlobalStyles } from "@mui/system";
import { type Decorator } from "@storybook/react";

import { previewGlobalStyles } from "./Layout.decorator.styles";

export enum LayoutOptions {
    Default = "default",
    Padded = "padded",
}

export const LayoutDecorator: Decorator = (fn, context) => {
    const { layout: selectedLayout } = context.globals;

    const theme = useTheme();
    return (
        <div>
            <GlobalStyles styles={previewGlobalStyles(theme)} />

            {selectedLayout === LayoutOptions.Padded ? <MainContent>{fn()}</MainContent> : fn()}
        </div>
    );
};
