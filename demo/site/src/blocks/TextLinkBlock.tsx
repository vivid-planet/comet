"use client";
import { PropsWithData, withPreview } from "@comet/cms-site";
import { DemoTextLinkBlockData } from "@src/blocks.generated";
import * as React from "react";
import styled from "styled-components";

import { LinkBlock } from "./LinkBlock";

export const TextLinkBlock = withPreview(
    ({ data: { link, text } }: PropsWithData<DemoTextLinkBlockData>) => {
        return <Link data={link}>{text}</Link>;
    },
    { label: "Link" },
);

const Link = styled(LinkBlock)`
    color: ${({ theme }) => theme.colors.black};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
