# react-admin

## Developoment

### Requirements

-   [docker & docker-compose](https://docs.docker.com/compose/)

### Run build and storybook

    docker-compose up # on linux
    docker-compose -f docker-compose.yml -f docker-compose.mac.yml up # on OSX

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


### Notes

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.
