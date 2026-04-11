import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { composeStories } from "@storybook/react-webpack5";
import { it } from "vitest";

type StoryModule = { default: Record<string, unknown> };

interface ComposedStory {
    play?: (context: Record<string, unknown>) => Promise<void>;
    run: (context?: Record<string, unknown>) => Promise<void>;
}

function findStoryFiles(dir: string): string[] {
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            results.push(...findStoryFiles(full));
        } else if (entry.endsWith(".stories.tsx")) {
            results.push(full);
        }
    }
    return results;
}

const srcDir = join(process.cwd(), "src");
const storyFiles = findStoryFiles(srcDir);

for (const file of storyFiles) {
    const label = `./${relative(srcDir, file)}`;

    it(label, async ({ skip }) => {
        let module: StoryModule;
        try {
            module = await import(file);
        } catch {
            skip();
            return;
        }

        const stories = composeStories(module) as unknown as Record<string, ComposedStory>;
        const playStories = Object.entries(stories).filter(([, story]) => story.play);

        if (playStories.length === 0) {
            skip();
            return;
        }

        for (const [, story] of playStories) {
            await story.run();
        }
    });
}
