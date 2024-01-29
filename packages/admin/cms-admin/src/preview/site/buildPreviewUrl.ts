export function buildPreviewUrl(previewUrl: string, previewPath: string, formattedSiteState: string) {
    const url = new URL(`${previewUrl}${previewPath}`);

    url.searchParams.append("__preview", `${formattedSiteState}`);

    return url.toString();
}
