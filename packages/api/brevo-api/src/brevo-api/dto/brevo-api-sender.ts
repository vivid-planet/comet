import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BrevoApiSender {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    @Field(() => Boolean)
    active: boolean;

    @Field(() => Array(BrevoIp), { nullable: true })
    ips?: Array<BrevoIp>;
}

@ObjectType()
class BrevoIp {
    @Field(() => String)
    ip: string;

    @Field(() => String)
    domain: string;

    @Field(() => Int)
    weight: number;
}
