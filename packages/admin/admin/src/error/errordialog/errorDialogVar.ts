import { makeVar } from "@apollo/client";

import { ErrorDialogOptions } from "./ErrorDialog";

export const errorDialogVar = makeVar<ErrorDialogOptions | undefined>(undefined);
