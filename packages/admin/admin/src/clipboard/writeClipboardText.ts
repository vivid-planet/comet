export let fallbackClipboardData: string | undefined;

export async function writeClipboardText(data: string): Promise<void> {
    // Always set fallback, which is used when reading from the clipboard is not supported/allowed.
    fallbackClipboardData = data;

    if (!("clipboard" in navigator)) {
        return;
    }

    // The "clipboard-write" permission is granted automatically to pages when they are the active tab
    // (see https://web.dev/async-clipboard/#security-and-permissions).
    return navigator.clipboard.writeText(data);
}
