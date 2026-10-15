# Demo on a DigitalOcean Droplet

Deploys the demo for internal use with Docker Compose, the same way the [Starter's Docker Compose deployment](https://github.com/vivid-planet/dextinity-starter/tree/main/.docker-compose) works. Postgres, imgproxy, Mailpit and Traefik run as containers next to the demo, and the DAM files are stored in a volume.

| Domain                                      | Serves                                     |
| ------------------------------------------- | ------------------------------------------ |
| `admin.demo.digitalocean.dextinity.com`     | Admin, API and Mailpit (under `/mailpit/`) |
| `demo.digitalocean.dextinity.com`           | Main site                                  |
| `secondary.demo.digitalocean.dextinity.com` | Secondary site                             |
| `preview.demo.digitalocean.dextinity.com`   | Site preview in the admin                  |

Admin and site require a login with a `vivid-planet.com` account. Both oauth2-proxies share their cookie on `.demo.digitalocean.dextinity.com`, so one login covers all domains. The API isn't exposed, only the oauth2-proxy and the site reach it.

The Dockerfiles are based on the Starter's, but build from the repository root, because the demo depends on the packages in this repository rather than on released versions.

## Setup

1. Create a Droplet (4 GB RAM is enough) with Docker, Git and Node.js 24. Add swap, because building the demo needs more memory than that: `fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`, and add `/swapfile none swap sw 0 0` to `/etc/fstab`.
2. Point the domains above to the Droplet's IP address.
3. Create an OIDC client on `login.vivid-planet.cloud` with these redirect URIs:
    - `https://admin.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://secondary.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://preview.demo.digitalocean.dextinity.com/oauth2/callback`
4. Clone this repository on the Droplet. In this folder, copy each `*.secrets.env.tpl` to `*.secrets.env` and fill it in:
    - Generate the passwords and secrets with `openssl rand -hex 16`, the imgproxy key and salt with `openssl rand -hex 32`, and the cookie secret with `openssl rand -base64 32 | tr -- '+/' '-_'`.
    - Use the same values wherever a name appears in more than one file. `POSTGRESQL_PWD` is `POSTGRES_PASSWORD` base64-encoded.
5. Run `./deploy.sh`.
6. Load the fixtures once: `docker compose exec api node dist/console.js fixtures`. Do this before opening the site, which would otherwise cache the empty responses for a while.

## Deployment

Run the following command on the Droplet. It pulls the latest changes, then builds and starts the containers.

```
./deploy.sh
```

## Limitations

- The Builds and Cron Jobs pages in the admin don't work, because they need Kubernetes.
- The Brevo features and the contact form (reCAPTCHA) aren't configured.
- Users are admins only if the IDP sends an `isAdmin` claim. Otherwise they can only edit the "main" domain.
