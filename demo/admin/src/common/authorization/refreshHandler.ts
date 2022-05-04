import { createRefreshHandler } from "@comet/react-app-auth";

import { authorizationManager } from "./authorizationManager";

export const refreshHandler = createRefreshHandler(authorizationManager);
refreshHandler.startAutomaticRefresh(60);
