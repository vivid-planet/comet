# Comet DXP

## Docs

Visit https://docs.comet-dxp.com/ to view the documentation.

## Getting started

### Prerequisites

The following tools need to be installed on your local machine.

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [nvm](https://github.com/nvm-sh/nvm)

### Setup workspace

Run the `install.sh` script to install dependencies and setup needed symlinks.

```bash
sh install.sh
```

_It is recommend to run `install.sh` every time you switch to the `main` branch._

### Start development processes

Start Comet Admin packages

```bash
yarn dev:admin
```

Start CMS packages

```bash
yarn dev:cms
```

It is also possbile to start specific microservices

```bash
yarn dev:cms:api # (api|admin|site)
```

#### Start Demo

```bash
yarn dev:demo
```

Demo will be available at

-   Admin: [http://localhost:8000/](http://localhost:8000/)
-   API: [http://localhost:4000/](http://localhost:4000/)
-   Site: [http://localhost:3000/](http://localhost:3000/)

It is also possbile to start specific microservices

```bash
yarn dev:demo:api # (api|admin|site)
```

#### Start Storybook

```bash
yarn storybook
```

Storybook will be available at [http://localhost:26638/](http://localhost:26638/)

## Develop in a project

### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start

## Notes

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.
