import config from "@src/config";
import { UserProvider } from "@vivid/react-oidc-client";
import * as Oidc from "oidc-client";
import * as React from "react";

export const userService = new Oidc.UserManager({
    authority: config.IDP_URL,
    client_id: config.IDP_CLIENT_ID,
    redirect_uri: `${config.ADMIN_URL}/process-token`,
    response_type: "code",
    scope: "offline openid profile email",
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    post_logout_redirect_uri: location.origin,
    revokeAccessTokenOnSignout: true,
    automaticSilentRenew: true,
});
// Oidc.Log.logger = console;

const CustomUserProvider: React.FunctionComponent = ({ children }) => (
    <UserProvider userManager={userService} postLoginRedirectUri="/">
        {children}
    </UserProvider>
);

export default CustomUserProvider;
