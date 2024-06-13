"use client";

import Link from "next/link";
import React from "react";
import { FormattedMessage } from "react-intl";

export const NotFoundContent = (): React.ReactElement => {
    return (
        <>
            <h1>
                <FormattedMessage id="notFound.headline" defaultMessage="Oops. Something went wrong." />
            </h1>
            <FormattedMessage id="notFound.text" defaultMessage="Sorry, the selected page is currently not available." />
            <Link href="/en">
                <FormattedMessage id="notFound.link" defaultMessage="Back to Homepage" />
            </Link>
        </>
    );
};
