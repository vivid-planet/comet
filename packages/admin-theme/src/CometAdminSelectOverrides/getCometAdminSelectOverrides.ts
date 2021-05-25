import { Overrides } from "@material-ui/core/styles/overrides";

import { getCometAdminSelectOverrides as getSelectOverrides } from "./select";

export const getCometAdminSelectOverrides = (): Overrides => ({
    CometAdminSelect: getSelectOverrides(),
});
