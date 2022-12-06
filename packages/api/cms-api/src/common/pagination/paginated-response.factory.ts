import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

import { PageInfo } from "./cursor/page-info";

export class PaginatedResponseFactory {
    /**
     * @deprecated Use {@link createOffsetLimit()} instead
     */
    static create<TNodeValue>(classRef: Type<TNodeValue>): Type {
        return this.createOffsetLimit<TNodeValue>(classRef);
    }

    static createOffsetLimit<TNodeValue>(classRef: Type<TNodeValue>): Type {
        @ObjectType()
        class PaginatedType {
            @Field(() => [classRef])
            nodes: TNodeValue[];

            @Field(() => Int)
            totalCount: number;

            constructor(nodes: TNodeValue[], totalCount: number) {
                this.nodes = nodes;
                this.totalCount = totalCount;
            }
        }

        return PaginatedType;
    }

    static createCursor<TNodeValue>(classRef: Type<TNodeValue>): Type {
        @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
        abstract class EdgeType {
            @Field(() => String)
            cursor: string;

            @Field(() => classRef)
            node: TNodeValue;
        }

        @ObjectType()
        class PaginatedType {
            @Field(() => [EdgeType], { nullable: true })
            edges: EdgeType[];

            @Field(() => PageInfo, { nullable: true })
            pageInfo: PageInfo;

            constructor(edges: EdgeType[], pageInfo: PageInfo) {
                this.edges = edges;
                this.pageInfo = pageInfo;
            }
        }

        return PaginatedType;
    }
}
