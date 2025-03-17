import { Type } from "@nestjs/common";
import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";

export interface EnumFilterInterface<TEnum> {
    isAnyOf?: TEnum[];
    equal?: TEnum;
    notEqual?: TEnum;
}

const map: Record<string, Type> = {};

export function createEnumFilter<TEnum extends { [key: string]: string }>(name: string, Enum: TEnum): Type {
    if (map[name]) {
        return map[name];
    }
    // TODO better typing of return value
    @InputType(`${name}EnumFilter`)
    class EnumFilter implements EnumFilterInterface<TEnum> {
        public type(): string {
            return "EnumFilter";
        }

        @Field(() => [Enum], { nullable: true })
        @IsOptional()
        @IsEnum(Enum, { each: true })
        isAnyOf?: TEnum[];

        @Field(() => Enum, { nullable: true })
        @IsOptional()
        @IsEnum(Enum)
        equal?: TEnum;

        @Field(() => Enum, { nullable: true })
        @IsOptional()
        @IsEnum(Enum)
        notEqual?: TEnum;
    }

    map[name] = EnumFilter;
    return EnumFilter;
}
