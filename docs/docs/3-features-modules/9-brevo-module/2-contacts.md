---
title: Contact Attributes
---

Brevo contacts are managed and stored directly within the Brevo platform. However, attributes must be set in the application to allow adding contacts according to your project's needs.

Add `BrevoContactAttributes` to store information for each contact, such as names, salutations, or any other data relevant to your use case.

`BrevoContactFilterAttributes` can be added for creating target groups that are used to create lists for sending emails to selected users.

## API

To add custom contact attributes, add `BrevoContactAttributes` and `BrevoContactFilterAttributes` to your project, as shown in this example:

```import { IsUndefinable } from "@comet/cms-api";
import { Embeddable, Enum } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { BrevoContactBranch, BrevoContactSalutation } from "./brevo-contact.enums";

@ObjectType()
@InputType("BrevoContactAttributesInput")
export class BrevoContactAttributes {
    @IsNotEmpty()
    @IsString()
    @Field()
    LASTNAME: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    FIRSTNAME: string;

    @Field(() => BrevoContactSalutation, { nullable: true })
    @IsEnum(BrevoContactSalutation)
    @IsUndefinable()
    SALUTATION?: BrevoContactSalutation;

    @Field(() => [BrevoContactBranch], { nullable: true })
    @IsEnum(BrevoContactBranch, { each: true })
    @Enum({ items: () => BrevoContactBranch, array: true })
    @IsUndefinable()
    BRANCH?: BrevoContactBranch[];
}

@Embeddable()
@ObjectType()
@InputType("BrevoContactFilterAttributesInput")
export class BrevoContactFilterAttributes {
    // index signature to match Array<any> | undefined in BrevoContactFilterAttributesInterface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Array<any> | undefined;

    @Field(() => [BrevoContactSalutation], { nullable: true })
    @IsEnum(BrevoContactSalutation, { each: true })
    @Enum({ items: () => BrevoContactSalutation, array: true })
    @IsUndefinable()
    SALUTATION?: BrevoContactSalutation[];

    @Field(() => [BrevoContactBranch], { nullable: true })
    @IsEnum(BrevoContactBranch, { each: true })
    @Enum({ items: () => BrevoContactBranch, array: true })
    @IsUndefinable()
    BRANCH?: BrevoContactBranch[];
}
```

_Be aware that at least one attribute in BrevoContactFilterAttributes must be set for technical reasons, even if filters are not needed in the project._

## Admin

## Brevo Account

Attributes must also be added in the Brevo application. Please visit: https://my.brevo.com/lists/add-attributes for adding or editing contact attributes.
