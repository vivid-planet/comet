export async function writeClipboardText(data: string): Promise<void> {
    // Always write to local storage, which is used as a fallback when reading from the clipboard is not supported/allowed.
    window.localStorage.setItem("comet_clipboard", data);

    if (!("clipboard" in navigator)) {
        return;
    }

    // The "clipboard-write" permission is granted automatically to pages when they are the active tab
    // (see https://web.dev/async-clipboard/#security-and-permissions).
    return navigator.clipboard.writeText(data);
}
