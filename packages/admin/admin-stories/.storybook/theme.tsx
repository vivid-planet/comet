import { create } from "@storybook/theming/create";

// @ts-ignore
import CometLogo from "./assets/comet-logo-header.svg";

export default create({
    base: "light",
    brandTitle: "Comet",
    brandUrl: "https://github.com/vivid-planet/comet-admin",
    brandImage: CometLogo,
});
