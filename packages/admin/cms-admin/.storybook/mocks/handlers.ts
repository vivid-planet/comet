import { actionLogDialogHandlers } from "./actionLogDialogHandler";
import { actionLogsHandlers } from "./actionLogsHandlers";
import { currentUserHandler } from "./currentUserHandler";

export const handlers = [currentUserHandler, ...actionLogDialogHandlers, ...actionLogsHandlers];
