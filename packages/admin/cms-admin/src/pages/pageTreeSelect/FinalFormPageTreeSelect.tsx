import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { GQLSelectedPageFragment } from "../../graphql.generated";
import PageTreeSelect from "./PageTreeSelect";

type Props = FieldRenderProps<GQLSelectedPageFragment | undefined | null, HTMLDivElement>;

export default function FinalFormPageTreeSelect({ input }: Props): JSX.Element {
    return <PageTreeSelect value={input.value} onChange={input.onChange} />;
}
