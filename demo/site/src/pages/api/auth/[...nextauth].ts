import NextAuth, { NextAuthOptions } from "next-auth";
import { NextApiHandler } from "next-auth/internals/utils";

// See https://next-auth.js.org/tutorials/refresh-token-rotation
async function refreshAccessToken(token) {
    try {
        const url = `${process.env.IDP_URL}/oauth2/token`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: new URLSearchParams({
                client_id: process.env.IDP_CLIENT_ID as string,
                client_secret: "",
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }).toString(),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

const options: NextAuthOptions = {
    providers: [
        {
            id: "vivid-planet-idp",
            name: "Vivid-Planet-IDP",
            type: "oauth",
            version: "2.0",
            clientId: process.env.IDP_CLIENT_ID as string,
            clientSecret: "",
            scope: "offline openid profile email",
            params: { grant_type: "authorization_code" },
            accessTokenUrl: `${process.env.IDP_URL}/oauth2/token`,
            authorizationUrl: `${process.env.IDP_URL}/oauth2/auth?response_type=code`,
            requestTokenUrl: `${process.env.IDP_URL}/oauth2/token`,
            profileUrl: `${process.env.IDP_URL}/userinfo`,
            domain: "",
            profile: (profile) => ({
                ...profile,
                id: profile.sub as string,
            }),
        },
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session(session: any, token: any) {
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
                session.error = token.error;
            }
            return session;
        },
        async jwt(token, user, account) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.accessToken,
                    accessTokenExpires: Date.now() + parseInt((account.expires_in as unknown) as string) * 1000,
                    refreshToken: account.refreshToken,
                    user,
                };
            }
            // Return previous token if the access token has not expired yet
            if (Date.now() < parseInt(token.accessTokenExpires as string)) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
    },
};

const NextAuthApi: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default NextAuthApi;
