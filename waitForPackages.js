const packageFolderMapping = {
    "@comet/admin": "packages/admin/admin",
    "@comet/admin-color-picker": "packages/admin/admin-color-picker",
    "@comet/admin-date-time": "packages/admin/admin-date-time",
    "@comet/admin-icons": "packages/admin/admin-icons",
    "@comet/admin-react-select": "packages/admin/admin-react-select",
    "@comet/admin-rte": "packages/admin/admin-rte",
    "@comet/admin-theme": "packages/admin/admin-theme",
    "@comet/blocks-admin": "packages/admin/blocks-admin",
    "@comet/cms-admin": "packages/admin/cms-admin",
    "@comet/cms-api": "packages/api/cms-api",
    "@comet/cms-site": "packages/site/cms-site",
};

const waitForPackages = (...packages) => {
    return "npx wait-on -l " + packages.map((package) => `${packageFolderMapping[package]}/lib/index.d.ts`).join(" ");
};

module.exports = waitForPackages;
