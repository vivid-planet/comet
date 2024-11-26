const fs = require("fs");

(async () => {
    await Promise.all([
        fs.promises.copyFile("packages/api/cms-api/schema.gql", "packages/admin/cms-admin/schema.gql"),
        fs.promises.copyFile("packages/api/cms-api/block-meta.json", "packages/admin/blocks-admin/block-meta.json"),
        fs.promises.copyFile("packages/api/cms-api/block-meta.json", "packages/admin/cms-admin/block-meta.json"),
        fs.promises.copyFile("packages/api/cms-api/block-meta.json", "packages/site/cms-site/block-meta.json"),

        fs.promises.copyFile("demo/api/block-meta.json", "demo/admin/block-meta.json"),
        fs.promises.copyFile("demo/api/block-meta.json", "demo/site/block-meta.json"),
        fs.promises.copyFile("demo/api/block-meta.json", "demo/site-pages/block-meta.json"),
        fs.promises.copyFile("demo/api/schema.gql", "demo/admin/schema.gql"),
        fs.promises.copyFile("demo/api/schema.gql", "demo/site/schema.gql"),
        fs.promises.copyFile("demo/api/schema.gql", "demo/site-pages/schema.gql"),
        fs.promises.copyFile("demo/api/src/comet-config.json", "demo/site/src/comet-config.json"),
        fs.promises.copyFile("demo/api/src/comet-config.json", "demo/site-pages/src/comet-config.json"),
        fs.promises.copyFile("demo/api/src/comet-config.json", "demo/admin/src/comet-config.json"),

        fs.promises.copyFile("demo/site-configs/site-configs.d.ts", "demo/api/src/site-configs.d.ts"),
        fs.promises.copyFile("demo/site-configs/site-configs.d.ts", "demo/admin/src/site-configs.d.ts"),
        fs.promises.copyFile("demo/site-configs/site-configs.d.ts", "demo/site/src/site-configs.d.ts"),
    ]);
})();
