# Comet Admin

## Development

### Requirements

-   [nvm](https://github.com/nvm-sh/nvm)
-   [mkcert](https://github.com/FiloSottile/mkcert)

#### Install certificates once.

```bash
mkcert -install
mkcert -key-file certs/privkey.pem -cert-file certs/cert.pem *.comet-dxp.dev
echo NODE_EXTRA_CA_CERTS=$(mkcert -CAROOT)/rootCA.pem > .env.local
```

Run `install.sh` once.

### Run build and storybook

```
yarn start
```

### Develop in an project

#### additional Requirements

-   [watchman](https://facebook.github.io/watchman/)
-   [wml](https://github.com/wix/wml)

###

    ./wml-add.sh ../example
    wml start

### Notes

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.
