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
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
`;

const Content = styled("div")`
    margin-top: 150px;
    max-width: 350px;
    text-align: center;
    color: white;
    font-family: Roboto, Helvetica, Arial, sans-serif;
`;

const Message = styled("p")`
    margin-top: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 300;
    margin-bottom: 40px;
`;

const CometLogo = styled("img")`
    width: 200px;
    margin-top: 100px;
`;

const RetryButton = styled("button")`
    cursor: pointer;
    appearance: none;
    border-radius: 2px;
    border: none;
    background-color: #29b6f6;
    padding: 10px 15px;
    text-transform: uppercase;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 16px;
    color: #f0f0f0;
    font-weight: 400;

    :focus {
        outline: none;
        background-color: #0086c3;
    }
`;

type AuthorizationErrorPageProps = React.PropsWithChildren<{
    error: string;
    onRetry: () => void;
}>;

export const AuthorizationErrorPage: React.FunctionComponent<AuthorizationErrorPageProps> = ({ error, onRetry }) => {
    return (
        <>
            <Root>
                <Content>
                    <Message>{JSON.stringify(error)}</Message>
                    <div>
                        <RetryButton onClick={onRetry}>
                            <FormattedMessage id="comet.generic.retry" defaultMessage="Retry" />
                        </RetryButton>
                    </div>
                    <CometLogo src={cometLogoUrl} alt="Comet Logo" />
                </Content>
            </Root>
        </>
    );
};
