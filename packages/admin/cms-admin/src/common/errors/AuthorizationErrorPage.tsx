import { messages } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const backgroundImageUrl = "https://idp.vivid-planet.cloud/comet-background.jpg";
const cometLogoUrl = "https://idp.vivid-planet.cloud/comet-logo-claim-white.svg";

const Root = styled("div")`
    background-color: #02070d;
    background-image: url(${backgroundImageUrl});
    background-size: cover;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    padding-left: 10px;
    padding-right: 10px;
`;

const Message = styled(Typography)`
    max-width: 350px;
    margin-bottom: 40px;
    color: white;
`;

const CometLogo = styled("img")`
    width: 200px;
    margin-top: 100px;
`;

type AuthorizationErrorPageProps = React.PropsWithChildren<{
    error: string;
    onRetry: () => void;
}>;

export const AuthorizationErrorPage: React.FunctionComponent<AuthorizationErrorPageProps> = ({ error, onRetry }) => {
    return (
        <Root>
            <Message align="center">{JSON.stringify(error)}</Message>
            <Button variant="contained" onClick={onRetry}>
                <FormattedMessage {...messages.retry} />
            </Button>
            <CometLogo src={cometLogoUrl} alt="Comet Logo" />
        </Root>
    );
};
