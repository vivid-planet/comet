# Comet DXP

![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/latest)
![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/canary)
![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/next-canary)

![main](https://github.com/vivid-planet/comet/actions/workflows/lint.yml/badge.svg?branch=main)
![next](https://github.com/vivid-planet/comet/actions/workflows/lint.yml/badge.svg?branch=next)

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

_It is recommended to run `install.sh` every time you switch to the `main` branch._

### Start development processes

[dev-process-manager](https://github.com/vivid-planet/dev-process-manager) is used for local development.

Start Comet Admin packages

```bash
pnpm run dev:admin
```

Start CMS packages

```bash
pnpm run dev:cms
```

It is also possbile to start specific microservices

```bash
pnpm run dev:cms:api # (api|admin|site)
```

#### Start Demo

```bash
pnpm run dev:demo
```

Demo will be available at

-   Admin: [http://localhost:8000/](http://localhost:8000/)
-   API: [http://localhost:4000/](http://localhost:4000/)
-   Site: [http://localhost:3000/](http://localhost:3000/)

It is also possbile to start specific microservices

```bash
pnpm run dev:demo:api # (api|admin|site)
```

#### Start Storybook

```bash
pnpm run storybook
```

Storybook will be available at [http://localhost:26638/](http://localhost:26638/)

#### Start Docs

```bash
pnpm run docs
```

The docs will be available at [http://localhost:3000/](http://localhost:3000/)

### Stop Processes

```bash
npx dev-pm shutdown
```

## Develop in a project

### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start

## Contributing

Please read our [Contributing](CONTRIBUTING.md) file.
