import { gql } from "@comet/site-nextjs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { type GQLContactFormMutation, type GQLContactFormMutationVariables } from "./route.generated";

const contactFormMutation = gql`
    mutation ContactForm($input: ContactFormArgs!) {
        submitContactForm(input: $input)
    }
`;

async function submitContactForm(values: GQLContactFormMutationVariables["input"]) {
    const graphQLFetch = createGraphQLFetch();

    const { submitContactForm } = await graphQLFetch<GQLContactFormMutation, GQLContactFormMutationVariables>(
        contactFormMutation,
        {
            input: values,
        },
        { method: "POST" },
    );

    return { submitContactForm };
}

const queryValidationSchema = z.object({
    name: z.string(),
    company: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string(),
    message: z.string(),
    privacyConsent: z.boolean(),
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const validationResult = queryValidationSchema.safeParse({
        name: body["name"],
        company: body["company"],
        email: body["email"],
        phone: body["phone"],
        subject: body["subject"],
        message: body["message"],
        privacyConsent: body["privacyConsent"],
    });

    if (!validationResult.success) {
        return NextResponse.json(
            {
                cause: validationResult.error,
                message: "Validation failed",
            },
            {
                status: 400,
            },
        );
    }

    try {
        const data = await submitContactForm(validationResult.data as GQLContactFormMutationVariables["input"]);

        return NextResponse.json(data, {
            status: 200,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Something went wrong processing the contact form" }, { status: 500 });
    }
}
