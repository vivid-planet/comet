import { Provider } from "oidc-provider";
import { staticUsers } from "./demo/api/src/auth/static-users.ts";

const provider = new Provider(`${process.env.IDP_SSO_URL}`, {
    clients: [
        {
            client_id: `${process.env.IDP_CLIENT_ID}`,
            client_secret: `${process.env.IDP_CLIENT_SECRET}`,
            redirect_uris: [`http://localhost:${process.env.AUTHPROXY_PORT}/oauth2/callback`],
            post_logout_redirect_uris: [`http://localhost:${process.env.AUTHPROXY_PORT}/oauth2/sign_out?rd=%2F`],
        },
    ],
    claims: {
        email: ["email"],
        profile: ["name"],
    },
    findAccount: async (ctx, sub) => {
        const index = parseInt(sub) - 1;
        const user = staticUsers[index] ? staticUsers[index] : staticUsers[0];
        return {
            accountId: sub,
            claims: () => ({ sub: sub, email: user.email, name: user.name }),
        };
    },
    conformIdTokenClaims: false,
});

provider.listen(process.env.IDP_PORT, () => {
    console.log(`oidc-provider listening on port ${process.env.IDP_PORT}, check ${process.env.IDP_SSO_URL}/.well-known/openid-configuration`);
});
