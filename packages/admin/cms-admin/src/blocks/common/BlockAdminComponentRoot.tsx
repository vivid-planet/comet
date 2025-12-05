import { Stack, StackBreadcrumbs } from "@comet/admin";
import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    title?: ReactNode;
}

const BlockAdminComponentRoot = (props: PropsWithChildren<Props>) => {
    const { children, title = <FormattedMessage id="comet.blocks" defaultMessage="Blocks" /> } = props;

    return (
        <Stack topLevelTitle={title}>
            <StackBreadcrumbs
                showBackButton
                sx={({ palette, spacing }) => ({
                    paddingTop: 0,
                    position: "sticky",
                    zIndex: 15,
                    backgroundColor: palette.background.default,
                    top: 0,
                })}
            />
            <Divider style={{ marginBottom: "16px" }} />
            <ChildrenContainer>{children}</ChildrenContainer>
        </Stack>
    );
};

export { BlockAdminComponentRoot };

const ChildrenContainer = styled("div")`
    .CometAdminRte-root > .CometAdminRteToolbar-root {
        top: 70px;
    }
`;
