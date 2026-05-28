import { Button, type ButtonProps } from "@comet/admin";
import { Time } from "@comet/admin-icons";
import { type PropsWithChildren, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ActionLogDialog } from "../actionLogDialog/ActionLogDialog";

type ActionLogButtonProps<TQuery> = PropsWithChildren<
    Omit<ButtonProps, "onClick" | "children"> & {
        id: string;
        /**
         * GraphQL root field exposing the entity (e.g. "manufacturer", "product").
         * The entity must expose `actionLog(id)` and `actionLogs(offset, limit, sort)` via `@ActionLogs()`.
         *
         * Pass your app's `GQLQuery` as the generic to constrain this to entities decorated with `@ActionLogs()`.
         */
        rootField: Parameters<typeof ActionLogDialog<TQuery>>[0]["rootField"];
        /**
         * Latest name of the entity, displayed in titles.
         */
        name?: string;
    }
>;

export function ActionLogButton<TQuery = Record<string, unknown>>({
    id,
    rootField,
    name,
    children,
    startIcon = <Time />,
    variant = "textDark",
    ...restProps
}: ActionLogButtonProps<TQuery>) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button {...restProps} variant={variant} startIcon={startIcon} onClick={() => setOpen(true)}>
                {children ?? <FormattedMessage id="comet.actionLogButton.title" defaultMessage="Action Log" />}
            </Button>
            <ActionLogDialog<TQuery> id={id} rootField={rootField} name={name} open={open} onClose={() => setOpen(false)} />
        </>
    );
}
