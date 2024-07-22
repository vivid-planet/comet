import slugify from "slugify";

export function slugifyFilename(filename: string, extension?: string): string {
    const extensionWithDot = extension === undefined ? "" : extension.startsWith(".") ? extension : `.${extension}`;
    return `${slugify(filename)}${extensionWithDot}`;
}
