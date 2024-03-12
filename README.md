# Comet DXP

![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/latest)
![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/canary)
![npm (scoped with tag)](https://img.shields.io/npm/v/%40comet/admin/next-canary)

![main](https://github.com/vivid-planet/comet/actions/workflows/lint.yml/badge.svg?branch=main)
![next](https://github.com/vivid-planet/comet/actions/workflows/lint.yml/badge.svg?branch=next)

## Docs

Visit https://docs.comet-dxp.com/ to view the documentation.

## Create a new Comet DXP project

Use `@comet/create-app` to create a new Comet DXP project. More information can be found in the [docs](https://docs.comet-dxp.com/docs/getting-started/).

## Development

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

### Build packages

Before starting individual development processes, build all Comet packages at least once.

```bash
pnpm run build:packages
```

_It is recommended to build all packages every time you switch to the `main` branch._

### Start development processes

[dev-process-manager](https://github.com/vivid-planet/dev-process-manager) is used for local development.
We recommend only running the development process you will need.
Typically, you will need a subset of the available development processes.

Here are a few examples:

1. You want to add a new component to `@comet/admin`

    Start the development process for `@comet/admin`:

    ```bash
    npx dev-pm start @comet-admin
    ```

    Create a development story in Storybook:

    ```bash
    pnpm run storybook
    ```

2. You want to add a CMS feature to the API

    Start the development process for `@comet/cms-api`:

    ```bash
    npx dev-pm start @cms-api
    ```

    Start Demo API:

    ```bash
    npx dev-pm start @demo-api
    ```

    The Demo API will be available at [http://localhost:4000/](http://localhost:4000/)

3. You want to add a CMS feature to the Admin

    Start the development process for `@comet/cms-admin`:

    ```bash
    npx dev-pm start @cms-admin
    ```

    Start Demo API and Admin:

    ```bash
    npx dev-pm start @demo-api @demo-admin
    ```

    The Demo Admin will be available at [http://localhost:8000/](http://localhost:8000/)

See [dev-pm.config.js](/dev-pm.config.js) for a list of all available processes and process groups.

#### Start Demo

```bash
npx dev-pm start @demo
```

Demo will be available at

-   Admin: [http://localhost:8000/](http://localhost:8000/)
-   API: [http://localhost:4000/](http://localhost:4000/)
-   Site: [http://localhost:3000/](http://localhost:3000/)

It is also possible to start specific microservices

```bash
npx dev-pm start @demo-api # (@demo-api|@demo-admin|@demo-site)
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

### Stop processes

```bash
npx dev-pm shutdown
```

### Dev scripts

We provide `dev:*` scripts for the most common use cases.
For example, to start the Demo, you can also run:

```bash
pnpm run dev:demo
```

However, we recommend directly using dev-process-manager for greater control over which development processes to start.

See [package.json](/package.json) for a list of all available dev scripts.

## Develop in a project

### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start

## Contributing

Please read our [Contributing](CONTRIBUTING.md) file.
