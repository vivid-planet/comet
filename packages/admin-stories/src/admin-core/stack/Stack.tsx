import { Stack, StackBreadcrumbsContainer } from "@comet/admin-core";
import { Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import styled from "styled-components";

const BreadcrumbsContainer = styled(StackBreadcrumbsContainer)`
    border: 1px solid red;
`;

function Story() {
    return (
        <Stack topLevelTitle="Stack" components={{ breadcrumbsContainer: BreadcrumbsContainer }}>
            <Typography>Foo</Typography>
        </Stack>
    );
}

storiesOf("@comet/admin-core/stack", module)
    .addDecorator(StoryRouter())
    .add("Stack", () => <Story />);
