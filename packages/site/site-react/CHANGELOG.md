# @comet/site-react

## 8.0.0-beta.5

## 7.25.0

## 7.24.0

## 7.23.0

## 7.22.0

### Patch Changes

- e4327e250: Add missing `"use client"` directive to `useBlockPreviewFetch`

## 7.21.1

## 7.21.0

### Minor Changes

- ede41201a: Introduce new package `@comet/site-react`

    While `@comet/cms-site` and `@comet/site-nextjs` are Next.js specific, `@comet/site-react` is framework-agnostic and works in all React projects.
    `@comet/site-react` is pure ESM and uses SCSS modules instead of `styled-components`.

    To load the CSS, you need to import it like this in your project:

    ```ts
    import "@comet/site-react/css";
    ```

    Also make sure the css is not tree-shaken by your bundler.
