import { addons, types } from "storybook/manager-api";

import { CopyMailHtmlButton } from "./CopyMailHtmlButton.js";
import { MjmlWarningsPanelContent, MjmlWarningsPanelTitle } from "./MjmlWarningsPanel.js";
import { UsePublicImageUrlsToggle } from "./UsePublicImageUrlsToggle.js";

const ADDON_ID = "comet-mail";
const COPY_HTML_TOOL_ID = `${ADDON_ID}/copy-html`;
const PUBLIC_URLS_TOOL_ID = `${ADDON_ID}/public-urls`;
const MJML_WARNINGS_PANEL_ID = `${ADDON_ID}/mjml-warnings`;

export function registerMailStorybookAddons(): void {
    addons.register(ADDON_ID, () => {
        addons.add(COPY_HTML_TOOL_ID, {
            type: types.TOOL,
            title: "Copy Mail HTML",
            render: CopyMailHtmlButton,
        });

        addons.add(PUBLIC_URLS_TOOL_ID, {
            type: types.TOOL,
            title: "Use Public Image URLs",
            render: UsePublicImageUrlsToggle,
        });

        addons.add(MJML_WARNINGS_PANEL_ID, {
            type: types.PANEL,
            title: MjmlWarningsPanelTitle,
            render: MjmlWarningsPanelContent,
        });
    });
}
