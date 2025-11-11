import { DialogContent as MuiDialogContent, IconButton } from "@mui/material";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { Dialog as CometDialog } from "../../Dialog";
import { type HelpDialogButtonClassKey } from "./HelpDialogButton";

export const Button = createComponentSlot(IconButton)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "button",
})();

export const Dialog = createComponentSlot(CometDialog)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "dialog",
})();

export const DialogContent = createComponentSlot(MuiDialogContent)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "dialogContent",
})();
