# react-admin

## Developoment

### Requirements

-   [docker & docker-compose](https://docs.docker.com/compose/)

### Run build and storybook

    docker-compose up # on linux
    docker-compose -f docker-compose.yml -f docker-compose.mac.yml up # on OSX

### use yarn

    docker-compose exec react-admin bash -c "yarn --help"
    docker-compose exec react-admin bash -c "cd packages/react-admin && yarn --help"

### Develop in an project

#### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start
