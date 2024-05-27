import { fallbackClipboardData } from "./writeClipboardText";

export async function readClipboardText(): Promise<string | undefined> {
    if (
        !("clipboard" in navigator) || // Browser doesn't support navigator.clipboard
        navigator.clipboard.readText === undefined // Firefox doesn't support navigator.clipboard.readText() by default
    ) {
        // Reading from clipboard isn't supported, fallback to in-memory clipboard.
        return fallbackClipboardData;
    }

    try {
        // We need to show a prompt to ask for clipboard access. Reading the clipboard triggers the prompt. The result of the read operation can
        // be used to check if access to the clipboard was granted by the user.
        const data = await navigator.clipboard.readText();
        return data;
    } catch {
        console.warn("Clipboard access denied, fallback to in-memory clipboard.");
        return fallbackClipboardData;
    }
}
