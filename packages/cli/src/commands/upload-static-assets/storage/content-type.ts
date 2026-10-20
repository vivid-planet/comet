// Browsers refuse stylesheets, and with nosniff scripts, that a storage serves with its default type application/octet-stream
const contentTypesByExtension: Record<string, string> = {
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
};

export function getContentType(key: string): string | undefined {
    return contentTypesByExtension[key.split(".").pop() ?? ""];
}
