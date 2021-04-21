import { CometAdminInputBaseClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

export default (): StyleRules<{}, CometAdminInputBaseClassKeys> => ({
    root: {
        borderColor: "#D9D9D9",
        borderRadius: 0,
        height: 36,
    },
    focused: {},
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
