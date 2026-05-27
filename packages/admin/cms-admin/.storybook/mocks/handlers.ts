import { actionLogDialogHandlers } from "./actionLogDialogHandler";
import { currentUserHandler } from "./currentUserHandler";

export const handlers = [currentUserHandler, ...actionLogDialogHandlers];
