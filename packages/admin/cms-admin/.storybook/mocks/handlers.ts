import { actionLogDialogHandlers } from "./actionLogDialogHandler";
import { currentUserHandler } from "./currentUserHandler";
import { globalActionLogHandlers } from "./globalActionLogHandlers";

export const handlers = [currentUserHandler, ...actionLogDialogHandlers, ...globalActionLogHandlers];
