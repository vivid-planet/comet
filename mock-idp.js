const Provider = require("oidc-provider");

const users = [
    {
        given_name: "Test",
        family_name: "Admin",
        name: "Test Admin",
        email: "admin@comet-dxp.com",
        email_verified: true,
        language: "en",
        role: {
            role: "admin",
            rights: ["right1", "right2"],
            domain: ["main", "secondary"],
        },
    },
    {
        given_name: "Test",
        family_name: "Superuser",
        name: "Test Superuser",
        email: "superuser@comet-dxp.com",
        email_verified: true,
        language: "en",
        role: {
            role: "superuser",
            rights: ["right1"],
            domain: ["main"],
        },
    },
    {
        given_name: "Test",
        family_name: "User",
        name: "Test User",
        email: "user@comet-dxp.com",
        email_verified: true,
        language: "en",
        role: {
            role: "user",
            rights: [],
            domain: ["secondary"],
        },
    },
];

const getUserBySub = (sub) => {
    let user = users.find((user) => user.email === sub);
    if (!user) user = users[0];
    return user;
};

const provider = new Provider(process.env.IDP_URL, {
    clients: [
        {
            client_id: "comet-demo",
            redirect_uris: [`${process.env.ADMIN_URL}/process-token`, `${process.env.SITE_URL}/api/auth/callback/vivid-planet-idp`],
            post_logout_redirect_uris: [process.env.ADMIN_URL, process.env.SITE_URL],
            response_types: ["code"],
            grant_types: ["authorization_code", "refresh_token"],
            token_endpoint_auth_method: "none",
        },
    ],
    claims: {
        profile: ["given_name", "family_name", "name"],
        email: ["email", "email_verified"],
        language: ["language"],
        role: ["role"],
    },
    issueRefreshToken: async (ctx, client, code) => {
        return true;
    },
    findAccount: (ctx, sub, token) => {
        return {
            accountId: sub,
            claims: (use, scope, claims, rejected) => getUserBySub(sub),
        };
    },
    extraTokenClaims: async (ctx, token) => {
        return {
            ext: getUserBySub(token.accountId).role,
        };
    },
    routes: {
        authorization: "/oauth2/auth",
        token: "/oauth2/token",
        userinfo: "/userinfo",
        revocation: "/oauth2/revoke",
        end_session: "/oauth2/sessions/logout",
        introspection: "/oauth2/introspect",
        backchannel_authentication: "/backchannel",
        code_verification: "/device",
        device_authorization: "/device/auth",
        jwks: "/jwks",
        pushed_authorization_request: "/request",
        registration: "/reg",
    },
    conformIdTokenClaims: false,
    clientBasedCORS: () => true,
    features: {
        introspection: {
            allowedPolicy: () => true, // Skip protection for local development
            enabled: true,
        },
    },
    pkce: {
        required: (ctx, client) => false, // next-auth doesn't use pkce
    },
});
provider.proxy = true;

provider.listen(process.env.IDP_PORT);
