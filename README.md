# Comet DXP

## Getting started

### Prerequisites

The following tools need to be installed on your local machine.

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [nvm](https://github.com/nvm-sh/nvm)
-   [mkcert](https://github.com/FiloSottile/mkcert)

### Install certificates

Install the custom certificate authority (CA).

```bash
mkcert -install
```

Create certificates for `*.comet-dxp.dev`.

```bash
mkcert -key-file certs/privkey.pem -cert-file certs/cert.pem "*.comet-dxp.dev"
```

Pass the CA file to Node.

```bash
echo NODE_EXTRA_CA_CERTS=$(mkcert -CAROOT)/rootCA.pem > .env.local
```

### Setup workspace

Run the `install.sh` script to install dependencies and setup needed symlinks.

```bash
sh install.sh
```

_It is recommend to run `install.sh` every time you switch to the `main` branch._

### Start development processes

Start _everything_ (Comet Admin packages, Comet Admin storybook, Comet CMS packages, Demo)

```bash
yarn dev
```

Storybook will be available at [http://localhost:26638/](http://localhost:26638/)

Demo will be available at

-   Admin: [https://admin-demo.comet-dxp.dev:8443/](https://admin-demo.comet-dxp.dev:8443/)
-   API: [https://api-demo.comet-dxp.dev:8443/](https://api-demo.comet-dxp.dev:8443/)
-   Site: [https://site-demo.comet-dxp.dev:8443/](https://site-demo.comet-dxp.dev:8443/)

#### Start standalone process

Start Comet Admin only (Comet Admin packages, Comet Admin storybook)

```bash
yarn dev:admin
```

Start CMS and Demo (Comet Admin packages, Comet CMS packages, Demo)

```bash
yarn dev:cms
```

## Develop in a project

### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start

## Notes

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.
