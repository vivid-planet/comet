import { Stack, StackBreadcrumbs } from "@comet/admin";
import { styled } from "@mui/material/styles";
import { PropsWithChildren, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
    title?: ReactNode;
}

const AdminComponentRoot = (props: PropsWithChildren<Props>) => {
    const { children, title = <FormattedMessage id="comet.blocks" defaultMessage="Blocks" /> } = props;

    return (
        <Stack topLevelTitle={title}>
            <StackBreadcrumbs
                sx={({ palette, spacing }) => ({
                    paddingTop: 0,
                    paddingBottom: spacing(4),
                    position: "sticky",
                    zIndex: 15,
                    backgroundColor: palette.background.default,
                    top: 0,
                })}
            />
            <ChildrenContainer>{children}</ChildrenContainer>
        </Stack>
    );
};

export { AdminComponentRoot };

const ChildrenContainer = styled("div")`
    > .CometAdminRte-root > .CometAdminRteToolbar-root {
        top: 70px;
    }
`;
