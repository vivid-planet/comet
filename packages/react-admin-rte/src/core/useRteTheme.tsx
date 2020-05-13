import * as React from "react";
import { IRteTheme, RteThemeContext } from "./Rte";

export default function useRteTheme(): IRteTheme {
    const theme = React.useContext(RteThemeContext);

    if (!theme) {
        throw new Error(`RTE-Theme can only be used inside provider of RteThemeContext.`);
    }

    return theme;
}
