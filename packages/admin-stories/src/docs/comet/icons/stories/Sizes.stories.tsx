import { Cookie } from "@comet/admin-icons";
import { makeStyles } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/Icons/Sizes", module)
    .add("Small Size Icon", () => {
        return <Cookie fontSize={"small"} />;
    })
    .add("Default Size Icon", () => {
        return <Cookie fontSize={"default"} />;
    })
    .add("Large Size Icon", () => {
        return <Cookie fontSize={"large"} />;
    })
    .add("Custom Size Icon", () => {
        const useStyles = makeStyles((theme) => ({
            largeIcon: {
                fontSize: 100,
            },
        }));
        const classes = useStyles();

        return <Cookie className={classes.largeIcon} />;
    });
