const fs = require("node:fs");
const path = require("node:path");

const files = [
    ...(process.env.CI === "true"
        ? []
        : [
              {
                  file: ".env",
                  targetDir: ["demo/admin", "demo/api", "demo/site", "demo/site-pages"],
              },
              {
                  file: ".env.local",
                  targetDir: ["demo/admin", "demo/api", "demo/site", "demo/site-pages", "storybook"],
              },
              {
                  file: ".env.site-configs",
                  targetDir: ["demo/admin", "demo/api", "demo/site"],
              },
          ]),
    {
        file: "packages/api/cms-api/block-meta.json",
        targetDir: ["packages/admin/cms-admin", "packages/site/site-nextjs", "packages/site/site-react"],
    },
    {
        file: "packages/api/cms-api/schema.gql",
        targetDir: ["packages/admin/cms-admin"],
    },
    {
        file: "demo/api/block-meta.json",
        targetDir: ["demo/admin", "demo/site", "demo/site-pages"],
    },
    {
        file: "demo/api/schema.gql",
        targetDir: ["demo/admin", "demo/site", "demo/site-pages"],
    },
    {
        file: "demo/api/src/comet-config.json",
        targetDir: ["demo/admin/src", "demo/site/src", "demo/site-pages/src"],
    },
    {
        file: "demo/site-configs/site-configs.d.ts",
        targetDir: ["demo/admin/src", "demo/api/src", "demo/site/src"],
    },
];

for (const { file, targetDir } of files) {
    for (const dir of targetDir) {
        const targetFile = `${dir}/${path.basename(file)}`;
        if (process.env.CI === "true") {
            fs.copyFileSync(file, targetFile);
        } else {
            try {
                fs.unlinkSync(targetFile);
            } catch (e) {}
            fs.symlinkSync(path.relative(dir, file), targetFile);
        }
    }
}
