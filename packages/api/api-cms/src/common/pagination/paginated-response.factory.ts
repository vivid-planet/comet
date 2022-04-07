import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export class PaginatedResponseFactory {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static create<TNodeValue>(classRef: Type<TNodeValue>): Type {
        @ObjectType()
        class PaginatedType {
            @Field(() => [classRef])
            nodes: TNodeValue[];

            @Field(() => Int)
            totalCount: number;

            @Field(() => Int, { nullable: true })
            nextPage?: number;

            @Field(() => Int, { nullable: true })
            previousPage?: number;

            @Field(() => Int, { nullable: true })
            totalPages?: number;

            constructor(nodes: TNodeValue[], totalCount: number, args: { offset: number; limit: number }) {
                const { offset, limit } = args;
                const page = offset / limit + 1;

                this.nodes = nodes;
                this.totalCount = totalCount;
                this.nextPage = totalCount > page * limit ? page + 1 : undefined;
                this.previousPage = page > 1 ? page - 1 : undefined;
                this.totalPages = Math.ceil(totalCount / limit);
            }
        }

        return PaginatedType;
    }
}
