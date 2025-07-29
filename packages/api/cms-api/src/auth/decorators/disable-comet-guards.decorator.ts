import { type CustomDecorator, SetMetadata } from "@nestjs/common";

export const DisableCometGuards = (): CustomDecorator<string> => {
    return SetMetadata("disableCometGuards", true);
};
