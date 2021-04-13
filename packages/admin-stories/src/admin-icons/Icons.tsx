import * as icons from "@comet/admin-icons";
import { SvgIcon, Typography } from "@material-ui/core";
import { color } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";

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
    margin-right: 20px;
`;

function Story() {
    const iconSet: Array<{ key: string; Icon: typeof SvgIcon }> = [];

    {
        Object.keys(icons).map((key) => {
            if (key !== "__esModule" && key != null) {
                // @ts-ignore
                const Icon = icons[key];
                if (Icon != null) {
                    iconSet.push({ key: key, Icon: Icon });
                }
            }
        });
    }

    return (
        <Root>
            {iconSet.map((values, index) => {
                const { key, Icon } = values;
                return (
                    <IconContainer key={key}>
                        <IconWrapper>
                            <Icon key={index} htmlColor={color("Tint Color", "#000000")} />
                        </IconWrapper>
                        <Typography>{key}</Typography>
                    </IconContainer>
                );
            })}
        </Root>
    );
}

storiesOf("@comet/admin-icons", module).add("Icon List", () => <Story />);
