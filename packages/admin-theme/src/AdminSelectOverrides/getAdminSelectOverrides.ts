import { Overrides } from "@material-ui/core/styles/overrides";

import { getSelectOverrides } from "./select";

export const getAdminSelectOverrides = (): Overrides => ({
    CometAdminSelect: getSelectOverrides(),
});
