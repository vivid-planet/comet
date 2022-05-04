/*eslint-env node*/

// See https://www.ory.sh/hydra/docs/reference/api/#create-an-oauth-20-client
const client = {
    client_id: process.env.IDP_CLIENT_ID,
    client_name: "Comet Demo Local DEV",
    client_uri: "https://admin-comet-demo.%VIVID_HOST_USERNAME%.dev.vivid-planet.cloud:8443",
    scope: "offline openid profile email",
    response_types: ["code"],
    grant_types: ["authorization_code", "refresh_token"],
    token_endpoint_auth_method: "none",
    redirect_uris: [`${process.env.ADMIN_URL}/process-token`, `${process.env.SITE_URL}/login/api/callback/vivid-planet-idp`],
    post_logout_redirect_uris: [`${process.env.ADMIN_URL}`, `${process.env.SITE_URL}`],
};
if (!process.env.IDP_API_URL) {
    console.error("Error: process.env.IDP_API_URL not set");
    process.exit();
}
console.log("Creating or updating IDP Client...");
const hydra = require("@ory/hydra-client");
const api = new hydra.AdminApi({
    basePath: process.env.IDP_API_URL,
    baseOptions: {
        headers: {
            "X-Forwarded-Proto": "https",
            Authorization: `Basic ${Buffer.from(`vivid:${process.env.IDP_API_PASSWORD}`).toString("base64")}`,
        },
    },
});
(async () => {
    const response = await api.listOAuth2Clients();
    const existingClient = response.data.filter((c) => c.client_id == client.client_id).reduce((i, c) => c, null);
    if (existingClient) {
        api.updateOAuth2Client(client.client_id, {
            ...existingClient,
            ...client,
            redirect_uris: [...new Set(existingClient.redirect_uris.concat(client.redirect_uris))],
            post_logout_redirect_uris: [...new Set(existingClient.post_logout_redirect_uris.concat(client.post_logout_redirect_uris))],
        });
        console.log("IDP Client Updated");
    } else {
        api.createOAuth2Client(client);
        console.log("IDP Client Created");
    }
})();
