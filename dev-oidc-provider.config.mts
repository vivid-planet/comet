import { defineConfig } from "@comet/dev-oidc-provider";
import { staticUsers } from "./demo/api/src/auth/static-users";

export default defineConfig({
    userProvider: () => staticUsers,
    client: {
        client_id: process.env.IDP_CLIENT_ID,
        client_secret: process.env.IDP_CLIENT_SECRET,
        redirect_uris: [`${process.env.AUTHPROXY_URL}/oauth2/callback`],
        post_logout_redirect_uris: [process.env.POST_LOGOUT_REDIRECT_URI],
    },
});
