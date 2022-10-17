let canReadClipboard: boolean;

export async function readClipboardText(): Promise<string | undefined> {
    if (!("clipboard" in navigator)) {
        // eslint-disable-next-line no-console
        console.warn("Browser doesn't support navigator.clipboard");
        return undefined;
    }

    if (canReadClipboard === true) {
        return navigator.clipboard.readText();
    }

    const permissionStatus = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });

    if (permissionStatus.state === "granted") {
        canReadClipboard = true;
        return navigator.clipboard.readText();
    } else if (permissionStatus.state === "denied") {
        // eslint-disable-next-line no-console
        console.error("Clipboard access denied");
        return undefined;
    } else {
        // We need to show a prompt to ask for clipboard access. Reading the clipboard triggers the prompt. The result of the read operation can
        // be used to check if access to the clipboard was granted by the user.
        try {
            const data = await navigator.clipboard.readText();
            canReadClipboard = true;
            return data;
        } catch {
            // eslint-disable-next-line no-console
            console.error("Clipboard access denied");
            return undefined;
        }
    }
}
