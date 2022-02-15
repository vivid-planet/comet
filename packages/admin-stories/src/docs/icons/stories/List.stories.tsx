import * as icons from "@comet/admin-icons";
import { styled, SvgIcon, Typography } from "@mui/material";
import { color } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/Icons/List", module).add("Icon List", () => {
    const Root = styled("div")`
        display: flex;
        flex-wrap: wrap;
    `;

    const IconContainer = styled("div")`
        padding: 10px;
        margin: 10px;
        display: flex;

        flex-wrap: wrap;
        width: 250px;
        align-items: center;
        border: 1px solid lightgray;
        border-radius: 2px;
    `;

    const IconWrapper = styled("div")`
        display: flex;
        align-items: center;
        margin-right: 10px;
    `;
    return (
        <Root>
            {Object.keys(icons).map((key) => {
                if (key !== "__esModule" && key != null) {
                    // TODO: Fix this
                    // @ts-ignore
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
});
