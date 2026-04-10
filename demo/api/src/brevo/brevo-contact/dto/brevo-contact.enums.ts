import { registerEnumType } from "@nestjs/graphql";

export enum BrevoContactSalutation {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

registerEnumType(BrevoContactSalutation, {
    name: "BrevoContactSalutation",
});

export enum BrevoContactBranch {
    PRODUCTS = "PRODUCTS",
    MARKETING = "MARKETING",
    NEWS = "NEWS",
}

registerEnumType(BrevoContactBranch, {
    name: "BrevoContactBranch",
});
