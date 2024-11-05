// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { User } from "@comet/cms-api";

declare module "@comet/cms-api" {
    interface User {
        isAdmin: boolean;
    }
}
