import type { Decorator } from "@storybook/react-vite";

import { ErrorDialogHandler } from "../../src/error/errordialog/ErrorDialogHandler";

export const ErrorDialogHandlerDecorator: Decorator = (Story) => (
    <>
        <ErrorDialogHandler />
        <Story />
    </>
);
