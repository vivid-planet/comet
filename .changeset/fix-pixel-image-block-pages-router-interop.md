---
"@comet/site-nextjs": patch
---

Fix `PixelImageBlock` and `Image` failing to render in Next.js Pages Router with `Error: Element type is invalid ... but got: object`

`@comet/site-nextjs` is published as ESM (`"type": "module"`) and the components used a default import of `next/image` (CJS). Under Next.js Pages Router the server bundler keeps node_modules ESM packages as Node-style externals, which applies Node-style ESM↔CJS interop: `import NextImage from "next/image"` yields the entire module-namespace object (`{ default, getImageProps, __esModule: true }`) instead of the component. The default import is now unwrapped at module evaluation time so the components work under both bundler-style and Node-style interop.
