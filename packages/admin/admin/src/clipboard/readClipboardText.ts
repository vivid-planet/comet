let canReadClipboard: boolean;

export async function readClipboardText(): Promise<string | undefined> {
    if (!("clipboard" in navigator)) {
        // eslint-disable-next-line no-console
        console.warn("Browser doesn't support navigator.clipboard");
        return undefined;
    }

    // Firefox does not support navigator.clipboard.readText() by default.
    if (navigator.clipboard.readText === undefined) {
        return window.localStorage.getItem("comet_clipboard") ?? undefined;
    }

    if (canReadClipboard === true) {
        return navigator.clipboard.readText();
    }

    let permissionStatus: PermissionStatus;

    try {
        permissionStatus = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });
    } catch (error) {
        // Firefox with "dom.events.asyncClipboard.readText" enabled via about:config. navigator.clipboard.readText() is available, but permission
        // 'clipboard-read' permission cannot be queried. We can still read the clipboard though.
        if (
            error instanceof TypeError &&
            error.message === "'clipboard-read' (value of 'name' member of PermissionDescriptor) is not a valid value for enumeration PermissionName."
        ) {
            canReadClipboard = true;
            return navigator.clipboard.readText();
        }

        throw error;
    }

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
