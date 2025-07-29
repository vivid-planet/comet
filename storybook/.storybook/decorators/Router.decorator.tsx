import { RouterMemoryRouter } from "@comet/admin";
import type { Decorator } from "@storybook/react";

export const RouterDecorator: Decorator = (fn) => {
    return <RouterMemoryRouter>{fn()}</RouterMemoryRouter>;
};
