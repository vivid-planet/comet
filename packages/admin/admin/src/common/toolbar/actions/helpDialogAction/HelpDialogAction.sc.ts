import { DialogContent, IconButton } from "@mui/material";

import { createComponentSlot } from "../../../../helpers/createComponentSlot";
import { Dialog } from "../../../Dialog";
import { type HelpDialogActionClassKey } from "./HelpDialogAction";

export const Root = createComponentSlot("div")<HelpDialogActionClassKey>({
    componentName: "HelpDialogAction",
    slotName: "root",
})();

export const HelpButton = createComponentSlot(IconButton)<HelpDialogActionClassKey>({
    componentName: "Toolbar",
    slotName: "button",
})();

export const HelpDialog = createComponentSlot(Dialog)<HelpDialogActionClassKey>({
    componentName: "Toolbar",
    slotName: "dialog",
})();

export const HelpDialogContent = createComponentSlot(DialogContent)<HelpDialogActionClassKey>({
    componentName: "Toolbar",
    slotName: "dialogContent",
})();
