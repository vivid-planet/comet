import { BlocksBlockAdditionalItemField, ListBlockAdditionalItemField } from "@comet/blocks-admin";
import { GQLUserGroup } from "@src/graphql.generated";

const userGroupAdditionalItemFields: { userGroup: ListBlockAdditionalItemField<GQLUserGroup> | BlocksBlockAdditionalItemField<GQLUserGroup> } = {
    userGroup: {
        defaultValue: "All",
    },
};

export { userGroupAdditionalItemFields };
