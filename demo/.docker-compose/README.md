# Demo on a DigitalOcean Droplet

Deploys the demo for internal use with Docker Compose, the same way the [Starter's Docker Compose deployment](https://github.com/vivid-planet/dextinity-starter/tree/main/.docker-compose) works. It runs on its own Droplet `dextinity-demo` in its own DigitalOcean project `dextinity-demo`, independent of the Starter. Postgres, imgproxy, Mailpit and Traefik run as containers next to the demo, and the DAM files are stored in a volume.

| Domain                                      | Serves                                     |
| ------------------------------------------- | ------------------------------------------ |
| `admin.demo.digitalocean.dextinity.com`     | Admin, API and Mailpit (under `/mailpit/`) |
| `demo.digitalocean.dextinity.com`           | Main site                                  |
| `secondary.demo.digitalocean.dextinity.com` | Secondary site                             |
| `preview.demo.digitalocean.dextinity.com`   | Site preview in the admin                  |

Admin and site require a login with a `vivid-planet.com` account. Both oauth2-proxies share their cookie on `.demo.digitalocean.dextinity.com`, so one login covers all domains. The API isn't exposed, only the oauth2-proxy and the site reach it.

The Dockerfiles are based on the Starter's, but build from the repository root, because the demo depends on the packages in this repository rather than on released versions.

## Deploying

The [Deploy Demo](../../.github/workflows/deploy-demo.yml) workflow deploys every push to `main`. It creates the project and the Droplet if they don't exist yet, copies the configuration and the secrets to the Droplet, and builds and starts the containers there.

## One-time setup

1. Create an SSH key without a passphrase, e.g. `ssh-keygen -t ed25519 -N "" -f dextinity-demo`. The workflow registers it at DigitalOcean and uses it to deploy.
2. Create an OIDC client on `login.vivid-planet.cloud` with these redirect URIs:
    - `https://admin.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://secondary.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://preview.demo.digitalocean.dextinity.com/oauth2/callback`
3. Add the variables and secrets below to this repository's GitHub Actions settings, and store the secrets in 1Password.
4. Run the workflow. Once it has created the Droplet, point the DNS records of the domains above to its IP address. Traefik requests the certificates as soon as the domains resolve.
5. Load the fixtures once: `ssh root@<droplet-ip>`, then `cd /opt/dextinity/demo/.docker-compose && docker compose exec api node dist/console.js fixtures`. Do this before opening the site, which would otherwise cache the empty responses for a while.

| Name                                                                                                                           | Kind     | Value                                                    |
| ------------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------- |
| `DIGITALOCEAN_API_KEY`                                                                                                         | secret   | DigitalOcean API token of the team                       |
| `DEMO_DROPLET_SSH_PRIVATE_KEY`                                                                                                 | secret   | Private key from step 1 (the `dextinity-demo` file)      |
| `DEMO_IDP_CLIENT_ID`                                                                                                           | variable | Client ID of the OIDC client                             |
| `DEMO_OAUTH2_PROXY_CLIENT_SECRET`                                                                                              | secret   | Client secret of the OIDC client                         |
| `DEMO_OAUTH2_PROXY_COOKIE_SECRET`                                                                                              | secret   | `openssl rand -base64 32 \| tr -- '+/' '-_'`             |
| `DEMO_POSTGRESQL_PASSWORD`                                                                                                     | secret   | `openssl rand -hex 16`                                   |
| `DEMO_IMGPROXY_KEY`, `DEMO_IMGPROXY_SALT`                                                                                      | secrets  | `openssl rand -hex 32` each                              |
| `DEMO_API_BASIC_AUTH_SYSTEM_USER_PASSWORD`, `DEMO_DAM_SECRET`, `DEMO_FILE_UPLOADS_DOWNLOAD_SECRET`, `DEMO_SITE_PREVIEW_SECRET` | secrets  | At least 16 characters each, e.g. `openssl rand -hex 16` |

## Limitations

- The Builds and Cron Jobs pages in the admin don't work, because they need Kubernetes.
- The Brevo features and the contact form (reCAPTCHA) aren't configured.
- Users are admins only if the IDP sends an `isAdmin` claim. Otherwise they can only edit the "main" domain.
