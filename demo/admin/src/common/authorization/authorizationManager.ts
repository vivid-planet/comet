import { createAuthorizationManager } from "@comet/react-app-auth";

import { authorizationConfig } from "./authorizationConfig";

export const authorizationManager = createAuthorizationManager({ authorizationConfig });
