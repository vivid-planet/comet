import "@storybook/react-webpack5";

import { type AdminGeneratorConfigParameters } from "../.storybook/addons/adminGeneratorConfigPanel/types";

declare module "@storybook/react-webpack5" {
    interface Parameters extends MswParameters, AdminGeneratorConfigParameters {}
}
