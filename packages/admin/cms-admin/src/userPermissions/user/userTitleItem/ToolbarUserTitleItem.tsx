import { useQuery } from "@apollo/client";
import { ToolbarTitleItem } from "@comet/admin";
import { type FunctionComponent } from "react";

import { userTitleItemQuery } from "./ToolbarUserTitleItem.gql";
import type { GQLUserTitleItemQuery, GQLUserTitleItemQueryVariables } from "./ToolbarUserTitleItem.gql.generated";
import { SupportText, TitleText } from "./ToolbarUserTitleItem.styles";
import { ToolbarUserTitleItemSkeleton } from "./ToolbarUserTitleItemSkeleton";

type UserTitleItemProps = {
    userId: string;
};
export const ToolbarUserTitleItem: FunctionComponent<UserTitleItemProps> = ({ userId }) => {
    const { data, error, loading } = useQuery<GQLUserTitleItemQuery, GQLUserTitleItemQueryVariables>(userTitleItemQuery, {
        variables: { id: userId },
    });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <ToolbarTitleItem>
            {loading || !data ? (
                <ToolbarUserTitleItemSkeleton />
            ) : (
                <>
                    <TitleText>{data.user.name}</TitleText>
                    <SupportText>{data.user.email}</SupportText>
                </>
            )}
        </ToolbarTitleItem>
    );
};
