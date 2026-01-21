import { MainContent } from "@comet/admin";
import { useTheme } from "@mui/material";
import { GlobalStyles } from "@mui/system";
import { type Decorator } from "@storybook/react-webpack5";

import { previewGlobalStyles } from "./Layout.decorator.styles";

export enum LayoutOption {
    Default = "default",
    Padded = "padded",
}

export const LayoutDecorator: Decorator = (fn, context) => {
    const { layout: selectedLayout } = context.globals;

    const theme = useTheme();
    return (
        <div>
            <GlobalStyles styles={previewGlobalStyles(theme)} />

            {selectedLayout === LayoutOption.Padded ? <MainContent>{fn()}</MainContent> : fn()}
        </div>
    );
};
