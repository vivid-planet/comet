import { Cookie, Error, ThreeDotSaving } from "@comet/admin-icons";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";

const SampleBox = styled.div`
    padding: 10px;
    margin: 10px;
    border: 1px solid lightgray;
    border-radius: 2px;
`;

const useStyles = makeStyles((theme) => ({
    largeIcon: {
        fontSize: 100,
    },
}));

function Story() {
    const classes = useStyles();

    return (
        <div>
            <SampleBox>
                <Typography variant={"h3"}>Simple Icon rendering</Typography>
                <Typography>
                    This is and Error <Error /> icon.
                </Typography>
            </SampleBox>

            <SampleBox>
                <Typography variant={"h3"}>Icon Sizes</Typography>
                <Typography>
                    Small: <Cookie fontSize={"small"} />
                </Typography>
                <Typography>
                    Default Size: <Cookie fontSize={"default"} />
                </Typography>

                <Typography>
                    Large: <Cookie fontSize={"large"} />
                </Typography>
                <Typography>
                    Custom Size (100) <Cookie className={classes.largeIcon} /> icon.
                </Typography>
            </SampleBox>

            <SampleBox>
                <Typography variant={"h3"}>Colors</Typography>
                <Typography>
                    No Color: <ThreeDotSaving />
                </Typography>

                <Typography>
                    Primary: <ThreeDotSaving color={"primary"} />
                </Typography>

                <Typography>
                    Secondary: <ThreeDotSaving color={"secondary"} />
                </Typography>
                <Typography>
                    Error: <ThreeDotSaving color={"error"} />
                </Typography>

                <Typography>
                    Disabled: <ThreeDotSaving color={"disabled"} />
                </Typography>
                <Typography>
                    Action: <ThreeDotSaving color={"action"} />
                </Typography>

                <Typography>
                    Custom (#ff00ff): <ThreeDotSaving htmlColor={"#ff00ff"} />
                </Typography>
            </SampleBox>
        </div>
    );
}

storiesOf("@comet/admin-icons", module).add("Icon Usage", () => <Story />);
