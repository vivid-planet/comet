import { Stack, StackBreadcrumbs as CometAdminStackBreadcrumbs } from "@comet/admin";
import { styled } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
}

const StackBreadcrumbs = withStyles(({ palette }) => ({
    root: {
        paddingTop: 0,
        paddingBottom: 20,
        position: "sticky",
        zIndex: 15,
        backgroundColor: palette.background.default,
        top: 0,
    },
}))(CometAdminStackBreadcrumbs);

function AdminComponentRoot(props: Props): React.ReactElement {
    const { children, title = <FormattedMessage id="comet.blocks" defaultMessage="Blocks" /> } = props;

    return (
        <Stack topLevelTitle={title}>
            <StackBreadcrumbs />
            <ChildrenContainer>{children}</ChildrenContainer>
        </Stack>
    );
}

export { AdminComponentRoot };

const ChildrenContainer = styled("div")`
    .CometAdminRteToolbar-root {
        top: 70px;
    }
`;
