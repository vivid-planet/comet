# Demo on DigitalOcean App Platform

Deploys the demo for internal use, the same way the [Starter](https://github.com/vivid-planet/dextinity-starter/tree/main/.digitalocean) is deployed. It reuses the Starter's database cluster, Spaces bucket and imgproxy app.

| App                   | Components                                | Domains                                                                                                                   |
| --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `dextinity-demo-cms`  | `api`, `admin`, `oauth2-proxy`, `mailpit` | `admin.demo.digitalocean.dextinity.com`                                                                                   |
| `dextinity-demo-site` | `site`, `oauth2-proxy`                    | `demo.digitalocean.dextinity.com`, `secondary.demo.digitalocean.dextinity.com`, `preview.demo.digitalocean.dextinity.com` |

Admin and site require a login with a `vivid-planet.com` account. Both oauth2-proxies share their cookie on `.demo.digitalocean.dextinity.com`, so one login covers all domains. Every mail the demo sends ends up in Mailpit at `https://admin.demo.digitalocean.dextinity.com/mailpit/`.

The images are built from the repository root (see the `*.Dockerfile`s), because the demo depends on the packages in this repository rather than on released versions.

## One-time setup

1. Create the database `db_demo` and the user `demo` on the Starter's database cluster.
2. Create an OIDC client on `login.vivid-planet.cloud` with these redirect URIs:
    - `https://admin.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://secondary.demo.digitalocean.dextinity.com/oauth2/callback`
    - `https://preview.demo.digitalocean.dextinity.com/oauth2/callback`
3. Copy `secrets.env.example` to `secrets.env` and fill it in. Store the values in 1Password.
4. From the repository root, run `demo/.digitalocean/deploy.sh create` and put the printed app IDs into `secrets.env`.
5. Point the DNS records of the domains above to the apps, as shown in the DigitalOcean console.
6. Load the fixtures once, from the console of the `api` component: `node dist/console.js fixtures`. Do this before opening the site, which would otherwise cache the empty responses for a while.

## Deploying

```bash
demo/.digitalocean/deploy.sh update
```

This applies the specs and deploys the `main` branch. Deployments are manual, like the Starter's.

## Limitations

- The Builds and Cron Jobs pages in the admin don't work, because they need Kubernetes.
- The Brevo features and the contact form (reCAPTCHA) aren't configured.
- Users are admins only if the IDP sends an `isAdmin` claim. Otherwise they can only edit the "main" domain.
