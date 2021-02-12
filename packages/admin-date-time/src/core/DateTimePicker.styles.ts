import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

export type CometAdminDateTimePickerClassKeys = "root" | "disabled" | "fullWidth" | "date" | "time";

const styles = (theme: Theme) =>
    createStyles<CometAdminDateTimePickerClassKeys, any>({
        root: {
            display: "inline-flex",
        },
        fullWidth: {
            display: "flex",
            "& $dateWrapper": {
                width: "auto",
            },
            "& $timeWrapper": {
                width: "auto",
            },
        },
        disabled: {},
        date: {
            marginRight: theme.spacing(1),
            width: 180,
        },
        time: {
            width: 120,
        },
    });

export default styles;
