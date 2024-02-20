// Make sure to import this file in ormconfig.cli.ts when using api-generator: require("../auth/permission.interface");

declare module "@comet/cms-api" {
    interface Permission {
        news: string;
        products: string;
    }
}

export {};
