import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { GQLSelectedPageFragment } from "../../graphql.generated";
import { AllCategories } from "../pageTree/PageTreeContext";
import PageTreeSelect from "./PageTreeSelect";

type Props = FieldRenderProps<GQLSelectedPageFragment | undefined | null, HTMLDivElement> & { allCategories?: AllCategories };

export default function FinalFormPageTreeSelect({ allCategories, input }: Props): JSX.Element {
    return <PageTreeSelect allCategories={allCategories} value={input.value} onChange={input.onChange} />;
}
