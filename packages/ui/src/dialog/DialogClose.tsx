"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactElement } from "react";

/** @experimental */
export interface DialogCloseProps {
    /**
     * The button that closes the dialog, such as `<Button variant="secondary">Cancel</Button>`. Its own
     * `onClick` still runs, so a button can run an action and close the dialog, for example "Delete". It must be
     * a component that passes its props and `ref` on to a `<button>`, as the package's buttons do.
     */
    children: ReactElement;
}

/**
 * Makes a button inside a `Dialog` close the dialog when it is clicked, such as "Cancel" in the dialog's
 * `actions`. It renders no element of its own: the button keeps its look, and the dialog returns focus to its
 * trigger.
 *
 * Use it for buttons whose action can't fail. To close the dialog only after a form is submitted
 * successfully, control the dialog with `open` and `onOpenChange` instead, and close it in the submit handler.
 *
 * @summary Closes the enclosing dialog when its button is clicked.
 * @experimental
 */
export function DialogClose({ children }: DialogCloseProps) {
    return <BaseDialog.Close render={children} />;
}
