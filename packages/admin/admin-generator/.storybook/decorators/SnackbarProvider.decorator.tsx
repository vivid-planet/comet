import { type Decorator } from "@storybook/react-webpack5";
import {  SnackbarProvider } from "@comet/admin";

export const SnackbarProviderDecorator: Decorator = (fn) => {
    return <SnackbarProvider>{fn()}</SnackbarProvider>;
};
