const packageFolderMapping = {
    "@comet/admin": "packages/admin/admin",
    "@comet/admin-color-picker": "packages/admin/admin-color-picker",
    "@comet/admin-date-time": "packages/admin/admin-date-time",
    "@comet/admin-icons": "packages/admin/admin-icons",
    "@comet/admin-rte": "packages/admin/admin-rte",
    "@comet/cms-admin": "packages/admin/cms-admin",
    "@comet/cms-api": "packages/api/cms-api",
    "@comet/site-nextjs": "packages/site/site-nextjs",
    "@comet/site-react": "packages/site/site-react",
};

const waitForPackages = (...packages) => {
    return "npx wait-on -l " + packages.map((package) => `${packageFolderMapping[package]}/lib/index.d.ts`).join(" ");
};

module.exports = waitForPackages;
