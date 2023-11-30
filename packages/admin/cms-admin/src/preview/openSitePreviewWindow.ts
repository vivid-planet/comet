function openSitePreviewWindow(previewPath: string, rootPath?: string): void {
    const queryParams = new URLSearchParams({ path: previewPath });
    const adminUrl = `${rootPath}/preview/?${queryParams.toString()}`;
    window.open(adminUrl);
}

/**
 * @deprecated Use openSitePreviewWindow instead
 */
const openPreviewWindow = openSitePreviewWindow;

export { openPreviewWindow, openSitePreviewWindow };
