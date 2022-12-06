import { Field, ObjectType } from "@nestjs/graphql";

interface PageInformation {
    edges: { cursor: string }[];
    countBefore: number;
    countAfter: number;
}

@ObjectType()
export class PageInfo {
    @Field(() => String, { nullable: true })
    startCursor: string | null;

    @Field(() => String, { nullable: true })
    endCursor: string | null;

    @Field(() => Boolean)
    hasPreviousPage: boolean;

    @Field(() => Boolean)
    hasNextPage: boolean;

    constructor({ edges, countBefore, countAfter }: PageInformation) {
        this.startCursor = edges.length > 0 ? edges[0].cursor : null;
        this.endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
        this.hasNextPage = countAfter > 0;
        this.hasPreviousPage = countBefore > 0;
    }
}
