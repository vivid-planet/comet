import { Stack, StackBreadcrumbs } from "@comet/admin";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
}

function AdminComponentRoot(props: Props): React.ReactElement {
    const { children, title = <FormattedMessage id="comet.blocks" defaultMessage="Blocks" /> } = props;

    return (
        <Stack topLevelTitle={title}>
            <StackBreadcrumbs
                sx={({ palette, spacing }) => ({
                    paddingTop: 0,
                    paddingBottom: "20px",
                    position: "sticky",
                    zIndex: 15,
                    backgroundColor: palette.background.default,
                    top: 0,
                    marginTop: spacing(-4),
                })}
            />
            <ChildrenContainer>{children}</ChildrenContainer>
        </Stack>
    );
}

export { AdminComponentRoot };

const ChildrenContainer = styled("div")`
    // TODO: Find another way to access this element, other than the className
    .CometAdminRteToolbar-root {
        top: 70px;
    }
`;
