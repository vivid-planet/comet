import * as icons from "@comet/admin-icons";
import { Attachment, Cookie, Error, ThreeDotSaving } from "@comet/admin-icons";
import { SvgIcon, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { color } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";

storiesOf("stories/icons", module)
    .add("Icon List", () => {
        const Root = styled.div`
            display: flex;
            flex-wrap: wrap;
        `;

        const IconContainer = styled.div`
            padding: 10px;
            margin: 10px;
            display: flex;

            flex-wrap: wrap;
            width: 250px;
            align-items: center;
            border: 1px solid lightgray;
            border-radius: 2px;
        `;

        const IconWrapper = styled.div`
            display: flex;
            align-items: center;
            margin-right: 10px;
        `;
        return (
            <Root>
                {Object.keys(icons).map((key) => {
                    if (key !== "__esModule" && key != null) {
                        const Icon = (icons as { [key: string]: typeof SvgIcon })[key];

                        return (
                            <IconContainer key={key}>
                                <IconWrapper>
                                    <Icon htmlColor={color("Tint Color", "#000000")} fontSize={"large"} />
                                </IconWrapper>
                                <Typography>{key}</Typography>
                            </IconContainer>
                        );
                    }
                })}
            </Root>
        );
    })
    .add("Icon", () => {
        return <Attachment />;
    })
    .add("Render Icon in Text", () => {
        return (
            <>
                <Typography variant={"h3"}>Simple Icon rendering</Typography>
                <Typography>
                    This is and Error <Error /> icon.
                </Typography>
            </>
        );
    })
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
    })
    .add("Default Color", () => {
        return <ThreeDotSaving />;
    })
    .add("Primary Color", () => {
        return <ThreeDotSaving color={"primary"} />;
    })
    .add("Secondary Color", () => {
        return <ThreeDotSaving color={"secondary"} />;
    })
    .add("Error Color", () => {
        return <ThreeDotSaving color={"error"} />;
    })
    .add("Disabled Color", () => {
        return <ThreeDotSaving color={"disabled"} />;
    })
    .add("Action Color", () => {
        return <ThreeDotSaving color={"action"} />;
    })
    .add("Custom Color", () => {
        return <ThreeDotSaving htmlColor={"#ff00ff"} />;
    });
