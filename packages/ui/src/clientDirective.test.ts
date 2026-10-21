import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const sourceDirectory = import.meta.dirname;

/**
 * A module that uses hooks or renders Base UI components only works in the browser. Without the directive,
 * importing it into a React Server Component fails, so applications such as the Next.js site couldn't use it.
 */
const needsBrowserPattern = /from "@base-ui\/react\/(?!merge-props")|from "\.\.\/slots\/SlotElement"|\b(use[A-Z]\w*|createContext)\(/;

const libraryModules = readdirSync(sourceDirectory, { recursive: true, encoding: "utf8" }).filter(
    (path) => /\.tsx?$/.test(path) && !/(^|\/)(__stories__|storybook|cssModules)\//.test(path) && !/\.(test|d)\.tsx?$/.test(path),
);

describe("client directive", () => {
    it.each(libraryModules.filter((path) => needsBrowserPattern.test(readFileSync(join(sourceDirectory, path), "utf8"))))(
        '%s starts with "use client"',
        (path) => {
            expect(readFileSync(join(sourceDirectory, path), "utf8").startsWith('"use client";')).toBe(true);
        },
    );
});
