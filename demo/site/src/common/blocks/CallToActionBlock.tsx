"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { CallToActionBlockData } from "@src/blocks.generated";
import { Button, ButtonVariant } from "@src/components/Button";
import { HiddenIfInvalidLink } from "@src/components/common/HiddenIfInvalidLink";

import { LinkBlock } from "./LinkBlock";

const buttonVariantMap: Record<CallToActionBlockData["variant"], ButtonVariant> = {
    Contained: "contained",
    Outlined: "outlined",
    Text: "text",
};

export const CallToActionBlock = withPreview(
    ({ data: { textLink, variant } }: PropsWithData<CallToActionBlockData>) => (
        <HiddenIfInvalidLink link={textLink.link}>
            <Button as={LinkBlock} data={textLink.link} variant={buttonVariantMap[variant]}>
                {textLink.text}
            </Button>
        </HiddenIfInvalidLink>
    ),
    { label: "Call To Action" },
);
