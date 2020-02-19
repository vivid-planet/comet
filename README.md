# react-admin

## Developoment

### Requirements

-   [docker & docker-compose](https://docs.docker.com/compose/)
-   [docker-sync](https://docker-sync.readthedocs.io/en/latest/) (**OSX only**)

### Run build and storybook

    Linux: `docker-compose up`
    OSX: `docker-sync-stack start`

### use yarn

    docker-compose exec react-admin bash -c "yarn --help"
    docker-compose exec react-admin bash -c "cd packages/react-admin-core && yarn --help"

### Develop in an project

#### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start
