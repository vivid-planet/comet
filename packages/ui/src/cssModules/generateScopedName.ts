import { createHash } from "node:crypto";

const componentModulePattern = /\/src\/[a-z][A-Za-z0-9]*\/([A-Z][A-Za-z0-9]*)\.module\.css$/;
const classNamePrefix = "dextinity";

/**
 * Produces the stable class names of the styling contract instead of hashed names: `root` in
 * `src/button/Button.module.css` becomes `dextinityButton`, any other class `dextinityButton__<name>`.
 *
 * Modules outside a component folder (stories, Storybook helpers) get a deterministic, file-scoped name.
 */
export function generateScopedName(name: string, filename: string): string {
    const componentName = filename.replaceAll("\\", "/").match(componentModulePattern)?.[1];

    if (componentName === undefined) {
        return `${name}_${createHash("sha1").update(`${filename}::${name}`).digest("hex").slice(0, 5)}`;
    }

    if (name === "root") {
        return `${classNamePrefix}${componentName}`;
    }

    return `${classNamePrefix}${componentName}__${name}`;
}
