import { create, type ThemeVars } from "storybook/theming";

import DextinityLogo from "./public/dextinity-logo-header.svg";

export default create({
    base: "light",
    brandTitle: "Dextinity",
    brandUrl: "https://github.com/vivid-planet/comet",
    brandImage: DextinityLogo,
}) as ThemeVars;
