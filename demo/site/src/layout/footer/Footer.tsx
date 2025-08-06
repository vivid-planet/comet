"use client";
import { type FragmentType, useFragment } from "@src/gql/fragment-masking";
import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";

import { footerFragment } from "./Footer.fragment";

interface Props {
    //footer: GQLFooterFragment;
    footer: FragmentType<typeof footerFragment>;
}

function Footer(props: Props) {
    const footer = useFragment(footerFragment, props.footer);
    return <FooterContentBlock data={footer.content} />;
}

export { Footer };
