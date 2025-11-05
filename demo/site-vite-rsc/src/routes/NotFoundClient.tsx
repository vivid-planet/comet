"use client";

import { FormattedMessage } from "react-intl";

export function NotFoundClient() {
    return (
        <div>
            <h1>
                <FormattedMessage id="notFound.title" defaultMessage="404 - Page Not Found" />
            </h1>
            <p>
                <FormattedMessage id="notFound.message" defaultMessage="The page you are looking for could not be found." />
            </p>
        </div>
    );
}
