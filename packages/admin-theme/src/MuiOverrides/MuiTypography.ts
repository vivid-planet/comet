import { TypographyClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiTypographyOverrides = (): OverridesStyleRules<TypographyClassKey> => ({
    root: {},
    body2: {},
    body1: {},
    caption: {},
    button: {},
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {},
    subtitle2: {},
    overline: {},
    inherit: {},
    alignLeft: {},
    alignCenter: {},
    alignRight: {},
    alignJustify: {},
    noWrap: {},
    gutterBottom: {
        marginBottom: 20,
    },
    paragraph: {},
});
