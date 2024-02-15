import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { ContentScope } from "../interfaces/content-scope.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AffectedArgSelector = string | ((args: any) => ContentScope);

export const AffectedArg = (selector: AffectedArgSelector): CustomDecorator<string> => {
    return SetMetadata("affectedArg", selector);
};
