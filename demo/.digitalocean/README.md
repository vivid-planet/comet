# Demo on DigitalOcean App Platform

Deploys the demo for internal use, the same way the [Starter](https://github.com/vivid-planet/dextinity-starter/tree/main/.digitalocean) is deployed. It reuses the Starter's database cluster, Spaces bucket and imgproxy app.

| App                   | Components                                | Domains                                                                                                                   |
| --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `dextinity-demo-cms`  | `api`, `admin`, `oauth2-proxy`, `mailpit` | `admin.demo.digitalocean.dextinity.com`                                                                                   |
| `dextinity-demo-site` | `site`, `oauth2-proxy`                    | `demo.digitalocean.dextinity.com`, `secondary.demo.digitalocean.dextinity.com`, `preview.demo.digitalocean.dextinity.com` |

Admin and site require a login with a `vivid-planet.com` account. Both oauth2-proxies share their cookie on `.demo.digitalocean.dextinity.com`, so one login covers all domains. Every mail the demo sends ends up in Mailpit at `https://admin.demo.digitalocean.dextinity.com/mailpit/`.

The images are built with Dockerfiles based on the Starter's [Docker Compose deployment](https://github.com/vivid-planet/dextinity-starter/tree/main/.docker-compose). Unlike the Starter's, they build from the repository root, because the demo depends on the packages in this repository rather than on released versions.

## One-time setup

1. Create the database `db_demo` and the user `demo` on the Starter's database cluster.
2. Create an OIDC client on `login.vivid-planet.cloud` with these redirect URIs:
    - `https://admin.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://secondary.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://preview.demo.digitalocean.dextinity.com/oauth2/callback`
3. Add the secrets below to this repository's GitHub Actions secrets, and store them in 1Password. The workflow passes them into the app specs.
4. Run the "Update DigitalOcean Demo Deployment" workflow, or merge into `main`. The first run creates the apps.
5. Point the DNS records of the domains above to the apps, as shown in the DigitalOcean console.
6. Load the fixtures once, from the console of the `api` component: `node dist/console.js fixtures`. Do this before opening the site, which would otherwise cache the empty responses for a while.

| Name                                                                                                                           | Value                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `DIGITALOCEAN_API_KEY`                                                                                                         | DigitalOcean API token of the team that hosts the Starter                 |
| `DEMO_IDP_CLIENT_ID` (variable, not a secret)                                                                                  | Client ID of the OIDC client                                              |
| `DEMO_OAUTH2_PROXY_CLIENT_SECRET`                                                                                              | Client secret of the OIDC client                                          |
| `DEMO_OAUTH2_PROXY_COOKIE_SECRET`                                                                                              | `openssl rand -base64 32 \| tr -- '+/' '-_'`                              |
| `DEMO_POSTGRESQL_PWD_BASE64`                                                                                                   | Password of the `demo` database user, base64-encoded                      |
| `DEMO_S3_ACCESS_KEY_ID`, `DEMO_S3_SECRET_ACCESS_KEY`                                                                           | Spaces key with access to the Starter's bucket                            |
| `DEMO_IMGPROXY_KEY`, `DEMO_IMGPROXY_SALT`                                                                                      | The Starter's imgproxy key and salt                                       |
| `DEMO_API_BASIC_AUTH_SYSTEM_USER_PASSWORD`, `DEMO_DAM_SECRET`, `DEMO_FILE_UPLOADS_DOWNLOAD_SECRET`, `DEMO_SITE_PREVIEW_SECRET` | At least 16 characters each, e.g. `openssl rand -hex 16`                  |
| `DEMO_BREVO_API_KEY`, `DEMO_BREVO_ECG_RTR_LIST_API_KEY`, `DEMO_BREVO_CAMPAIGN_BASIC_AUTH_PASSWORD`                             | Any value. The API requires them, but the Brevo features aren't used here |

## Deploying

The [Update DigitalOcean Demo Deployment](../../.github/workflows/update-digital-ocean-demo-deployment.yml) workflow deploys every push to `main`, like the Starter's. It can also be started manually.

## Limitations

- The Builds and Cron Jobs pages in the admin don't work, because they need Kubernetes.
- The Brevo features and the contact form (reCAPTCHA) aren't configured.
- Users are admins only if the IDP sends an `isAdmin` claim. Otherwise they can only edit the "main" domain.
