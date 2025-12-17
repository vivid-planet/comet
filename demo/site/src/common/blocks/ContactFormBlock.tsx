"use client";
import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type ContactFormBlockData } from "@src/blocks.generated";

export const ContactFormBlock = withPreview(
    ({ data }: PropsWithData<ContactFormBlockData>) => {
        return <>Contact Form</>;
    },
    { label: "Contact Form" },
);
