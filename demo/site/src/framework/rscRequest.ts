// RSC requests are distinguished from HTML requests by a pathname suffix (instead of a header) so that CDNs cache them separately
export const rscPathnameSuffix = "_.rsc";

export function createRscUrl(href: string) {
    const url = new URL(href, window.location.href);
    url.pathname += rscPathnameSuffix;
    url.hash = "";
    return url;
}

export function stripRscSuffix(url: URL) {
    if (!url.pathname.endsWith(rscPathnameSuffix)) {
        return null;
    }
    const strippedUrl = new URL(url);
    strippedUrl.pathname = url.pathname.slice(0, -rscPathnameSuffix.length);
    return strippedUrl;
}
