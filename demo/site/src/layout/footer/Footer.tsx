"use client";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";

import { GQLFooterFragment } from "./Footer.fragment.generated";

interface Props {
    footer: GQLFooterFragment;
}

function Footer({ footer }: Props) {
    return <FooterContentBlock data={footer.content} />;
}

export { Footer };
