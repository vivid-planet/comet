import { type Decorator } from "@storybook/react-vite";
import {  SnackbarProvider } from "@comet/admin";

export const SnackbarProviderDecorator: Decorator = (fn) => {
    return <SnackbarProvider>{fn()}</SnackbarProvider>;
};
