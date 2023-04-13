import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Tag } from "./Tag";

export const ArchivedTag: React.VoidFunctionComponent = () => {
    return (
        <Tag type="info">
            <FormattedMessage id="comet.pages.dam.tag.archived" defaultMessage="Archived" />
        </Tag>
    );
};
