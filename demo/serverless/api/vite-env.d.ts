// The Worker is built by Vite, which replaces import.meta.env. vite/client can't be used, its types need the DOM.
interface ImportMetaEnv {
    readonly DEV: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
