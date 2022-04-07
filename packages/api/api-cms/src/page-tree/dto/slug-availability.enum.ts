import { registerEnumType } from "@nestjs/graphql";

export enum SlugAvailability {
    Available = "Available",
    Taken = "Taken",
    Reserved = "Reserved",
}

registerEnumType(SlugAvailability, { name: "SlugAvailability" });
