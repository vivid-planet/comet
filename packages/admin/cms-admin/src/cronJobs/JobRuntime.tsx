import { differenceInMinutes, isSameDay } from "date-fns";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

interface RuntimeProps {
    startTime?: Date;
    completionTime?: Date;
}

export function JobRuntime(props: RuntimeProps) {
    const { startTime, completionTime } = props;

    if (startTime && completionTime) {
        const runtime = differenceInMinutes(completionTime, startTime);

        return (
            <>
                <FormattedDate value={startTime} day="2-digit" month="2-digit" year="numeric" /> <FormattedTime value={startTime} /> -{" "}
                {isSameDay(new Date(), completionTime) ? (
                    <FormattedTime value={completionTime} />
                ) : (
                    <>
                        <FormattedDate value={completionTime} day="2-digit" month="2-digit" year="numeric" /> <FormattedTime value={completionTime} />
                    </>
                )}{" "}
                ({runtime > 0 ? runtime : "< 1 "} <FormattedMessage id="comet.pages.publisher.runtime.minutes" defaultMessage="min" />)
            </>
        );
    }

    if (startTime) {
        return (
            <>
                <FormattedDate value={startTime} day="2-digit" month="2-digit" year="numeric" /> <FormattedTime value={startTime} />
            </>
        );
    }

    return null;
}
