import { composeStories } from "@storybook/react-webpack5";
import { describe, it } from "vitest";

import * as AddDialogEditPageStories from "./AddDialogEditPage.stories";

describe("AddDialogEditPage", () => {
    const stories = composeStories(AddDialogEditPageStories);

    for (const [name, Story] of Object.entries(stories)) {
        if (Story.play) {
            it(name, async () => {
                await Story.run();
            });
        }
    }
});
