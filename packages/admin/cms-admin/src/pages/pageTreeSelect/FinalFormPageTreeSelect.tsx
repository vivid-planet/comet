import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import PageTreeSelect from "./PageTreeSelect";
import { GQLSelectedPageFragment } from "./PageTreeSelectDialog";

type Props = FieldRenderProps<GQLSelectedPageFragment | undefined | null, HTMLDivElement>;

export default function FinalFormPageTreeSelect({ input }: Props): JSX.Element {
    return <PageTreeSelect value={input.value} onChange={input.onChange} />;
}
