import { InputType } from "@nestjs/graphql";

@InputType()
export class NestedObject {
    test: string;
}

export type NestedType = {
    test: string;
};
