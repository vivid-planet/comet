import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum SlugAvailability {
    Available = "Available",
    Taken = "Taken",
    Reserved = "Reserved",
}
/* eslint-enable @typescript-eslint/naming-convention */

registerEnumType(SlugAvailability, { name: "SlugAvailability" });
