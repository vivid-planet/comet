import { DialogContent, IconButton } from "@mui/material";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { Dialog } from "../../Dialog";
import { type HelpDialogButtonClassKey } from "./HelpDialogButton";

export const Root = createComponentSlot("div")<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "root",
})();

export const HelpButton = createComponentSlot(IconButton)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "button",
})();

export const HelpDialog = createComponentSlot(Dialog)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "dialog",
})();

export const HelpDialogContent = createComponentSlot(DialogContent)<HelpDialogButtonClassKey>({
    componentName: "HelpDialogButton",
    slotName: "dialogContent",
})();
