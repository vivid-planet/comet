/// <reference types="@comet/admin-theme" />
/// <reference types="vite/client" />
/// <reference types="@comet/admin-theme" />

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
    const content: any;
    export = content;
}

declare module "*.png" {
    const content: any;
    export = content;
}

declare module "*.jpg" {
    const content: any;
    export = content;
}

declare module "react-xml-viewer";
