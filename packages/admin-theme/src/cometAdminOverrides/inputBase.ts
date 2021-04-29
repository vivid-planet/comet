import { CometAdminInputBaseClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, neutrals } from "../colors";

export default (): StyleRules<{}, CometAdminInputBaseClassKeys> => ({
    root: {
        borderColor: neutrals[100],
        borderRadius: 2,
        height: 36,
    },
    focused: {
        borderColor: bluePalette.main,
    },
    adornedStart: {},
    adornedEnd: {},
    input: {
        lineHeight: "20px",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
    },
});
