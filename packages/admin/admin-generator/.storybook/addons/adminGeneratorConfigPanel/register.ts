import { addons, types } from "storybook/manager-api";
// @ts-ignore
import React from "react";
import { ADDON_ID, PANEL_ID } from "./constants";
import { AdminGeneratorConfigPanel } from "./AdminGeneratorConfigPanel";

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: "Comet Admin Generator Config",
        match: ({ viewMode }) => viewMode === "story",
        render: ({ active = false }) => {
            return React.createElement(AdminGeneratorConfigPanel, { active });
        },
    });
});
