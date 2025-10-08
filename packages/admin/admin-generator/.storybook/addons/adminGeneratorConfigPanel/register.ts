import { addons, types } from "storybook/manager-api";
// @ts-ignore
import React from "react";
import { addonId, panelId } from "./constants";
import { AdminGeneratorConfigPanel } from "./AdminGeneratorConfigPanel";

addons.register(addonId, () => {
    addons.add(panelId, {
        type: types.PANEL,
        title: "Comet Admin Generator Config",
        match: ({ viewMode }) => viewMode === "story",
        render: ({ active = false }) => {
            return React.createElement(AdminGeneratorConfigPanel, { active });
        },
    });
});
