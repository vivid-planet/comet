import { AuthConfiguration } from "@comet/react-app-auth";
import config from "@src/config";

export const authorizationConfig: AuthConfiguration = {
    issuer: config.IDP_URL,
    clientId: config.IDP_CLIENT_ID,
    redirectUrl: `${config.ADMIN_URL}/process-token`,
    responseType: "code",
    scope: "offline openid profile email",
    usePKCE: true,
};
