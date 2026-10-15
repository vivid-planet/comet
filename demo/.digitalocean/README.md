# Demo on DigitalOcean App Platform

Deploys the demo for internal use, the same way the [Starter](https://github.com/vivid-planet/dextinity-starter/tree/main/.digitalocean) is deployed. It runs in its own DigitalOcean project with its own database cluster, Spaces bucket and imgproxy, independent of the Starter.

| App                       | Components                                | Domains                                                                                                                   |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `dextinity-demo-cms`      | `api`, `admin`, `oauth2-proxy`, `mailpit` | `admin.demo.digitalocean.dextinity.com`                                                                                   |
| `dextinity-demo-site`     | `site`, `oauth2-proxy`                    | `demo.digitalocean.dextinity.com`, `secondary.demo.digitalocean.dextinity.com`, `preview.demo.digitalocean.dextinity.com` |
| `dextinity-demo-imgproxy` | `darthsim-imgproxy`                       | `imgproxy.demo.digitalocean.dextinity.com`                                                                                |

Admin and site require a login with a `vivid-planet.com` account. Both oauth2-proxies share their cookie on `.demo.digitalocean.dextinity.com`, so one login covers all domains. Every mail the demo sends ends up in Mailpit at `https://admin.demo.digitalocean.dextinity.com/mailpit/`.

The images are built with Dockerfiles based on the Starter's [Docker Compose deployment](https://github.com/vivid-planet/dextinity-starter/tree/main/.docker-compose). Unlike the Starter's, they build from the repository root, because the demo depends on the packages in this repository rather than on released versions.

## One-time setup

1. Create the DigitalOcean project `dextinity-demo` in the team that hosts the Starter.
2. In that project, create:
    - a managed PostgreSQL cluster in `fra1` with the database `db_demo` and the user `demo`
    - the Spaces bucket `dextinity-demo` in `fra1` and a Spaces access key for it
3. Commit the cluster's CA certificate, from the cluster's connection details, as `digitalocean-postgresql-ca.crt` in this folder. The API trusts it through `NODE_EXTRA_CA_CERTS`.
4. Create an OIDC client on `login.vivid-planet.cloud` with these redirect URIs:
    - `https://admin.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://secondary.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://preview.demo.digitalocean.dextinity.com/oauth2/callback`
5. Add the variables and secrets below to this repository's GitHub Actions settings, and store the secrets in 1Password. The workflow passes them into the app specs.
6. Run the "Update DigitalOcean Demo Deployment" workflow, or merge into `main`. The first run creates the apps.
7. Point the DNS records of the domains above to the apps, as shown in the DigitalOcean console.
8. Load the fixtures once, from the console of the `api` component: `node dist/console.js fixtures`. Do this before opening the site, which would otherwise cache the empty responses for a while.

| Name                                                                                                                           | Kind     | Value                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------- |
| `DIGITALOCEAN_API_KEY`                                                                                                         | secret   | DigitalOcean API token of the team                                        |
| `DEMO_DIGITALOCEAN_PROJECT_ID`                                                                                                 | variable | ID of the `dextinity-demo` project                                        |
| `DEMO_POSTGRESQL_HOST`                                                                                                         | variable | Host of the database cluster                                              |
| `DEMO_IDP_CLIENT_ID`                                                                                                           | variable | Client ID of the OIDC client                                              |
| `DEMO_OAUTH2_PROXY_CLIENT_SECRET`                                                                                              | secret   | Client secret of the OIDC client                                          |
| `DEMO_OAUTH2_PROXY_COOKIE_SECRET`                                                                                              | secret   | `openssl rand -base64 32 \| tr -- '+/' '-_'`                              |
| `DEMO_POSTGRESQL_PWD_BASE64`                                                                                                   | secret   | Password of the `demo` database user, base64-encoded                      |
| `DEMO_S3_ACCESS_KEY_ID`, `DEMO_S3_SECRET_ACCESS_KEY`                                                                           | secrets  | The Spaces access key                                                     |
| `DEMO_IMGPROXY_KEY`, `DEMO_IMGPROXY_SALT`                                                                                      | secrets  | `openssl rand -hex 32` each                                               |
| `DEMO_API_BASIC_AUTH_SYSTEM_USER_PASSWORD`, `DEMO_DAM_SECRET`, `DEMO_FILE_UPLOADS_DOWNLOAD_SECRET`, `DEMO_SITE_PREVIEW_SECRET` | secrets  | At least 16 characters each, e.g. `openssl rand -hex 16`                  |
| `DEMO_BREVO_API_KEY`, `DEMO_BREVO_ECG_RTR_LIST_API_KEY`, `DEMO_BREVO_CAMPAIGN_BASIC_AUTH_PASSWORD`                             | secrets  | Any value. The API requires them, but the Brevo features aren't used here |

## Deploying

The [Update DigitalOcean Demo Deployment](../../.github/workflows/update-digital-ocean-demo-deployment.yml) workflow deploys every push to `main`, like the Starter's. It can also be started manually.

## Limitations

- The Builds and Cron Jobs pages in the admin don't work, because they need Kubernetes.
- The Brevo features and the contact form (reCAPTCHA) aren't configured.
- Users are admins only if the IDP sends an `isAdmin` claim. Otherwise they can only edit the "main" domain.
