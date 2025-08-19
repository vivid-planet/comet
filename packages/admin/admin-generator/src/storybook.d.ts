import "@storybook/react";

import { type MswParameters } from "msw-storybook-addon";

import { type AdminGeneratorConfigParameters } from "../.storybook/addons/adminGeneratorConfigPanel/types";

declare module "@storybook/react" {
    interface Parameters extends MswParameters, AdminGeneratorConfigParameters {}
}
