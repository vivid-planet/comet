import { create, type ThemeVars } from "storybook/theming";

import CometLogo from "./assets/comet-logo-header.svg";

export default create({
    base: "light",
    brandTitle: "Comet",
    brandUrl: "https://github.com/vivid-planet/comet",
    brandImage: CometLogo,
}) as ThemeVars;
