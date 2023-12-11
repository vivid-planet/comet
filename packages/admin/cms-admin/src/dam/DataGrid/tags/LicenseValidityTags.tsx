import { WarningSolid } from "@comet/admin-icons";
import { formatDistanceToNow } from "date-fns";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Tag } from "./Tag";

export const LicenseNotValidYetTag: React.VoidFunctionComponent = () => {
    return (
        <Tag type="error">
            <WarningSolid />
            <FormattedMessage id="comet.pages.dam.tag.licenseNotValidYet" defaultMessage="License not valid yet" />
        </Tag>
    );
};

export const LicenseExpiredTag: React.VoidFunctionComponent = () => {
    return (
        <Tag type="error">
            <WarningSolid />
            <FormattedMessage id="comet.pages.dam.tag.licenseExpired" defaultMessage="License expired" />
        </Tag>
    );
};

interface LicenseExpiresSoonTagProps {
    expirationDate: Date;
}

export const LicenseExpiresSoonTag = ({ expirationDate }: LicenseExpiresSoonTagProps) => {
    return (
        <Tag type="warning">
            <WarningSolid />
            <FormattedMessage
                id="comet.pages.dam.tag.licenseExpiresSoon"
                defaultMessage="License expires in {distance}"
                values={{
                    distance: formatDistanceToNow(expirationDate),
                }}
            />
        </Tag>
    );
};

interface LicenseValidityTagsProps {
    expirationDate?: Date;
    isNotValidYet?: boolean;
    expiresWithinThirtyDays?: boolean;
    hasExpired?: boolean;
}

export const LicenseValidityTags = ({ expirationDate, isNotValidYet, expiresWithinThirtyDays, hasExpired }: LicenseValidityTagsProps) => {
    return (
        <>
            {isNotValidYet && <LicenseNotValidYetTag />}
            {expirationDate && expiresWithinThirtyDays && <LicenseExpiresSoonTag expirationDate={expirationDate} />}
            {hasExpired && <LicenseExpiredTag />}
        </>
    );
};
