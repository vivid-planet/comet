import type { Decorator } from "@storybook/react-vite";

import { CssVarsProvider } from "../components/cssVarsProvider/CssVarsProvider";

/**
 * Wraps a story in {@link CssVarsProvider}. Opt in per story file through `meta.decorators`.
 */
export const cssVarsProviderDecorator: Decorator = (Story) => (
    <CssVarsProvider>
        <Story />
    </CssVarsProvider>
);
