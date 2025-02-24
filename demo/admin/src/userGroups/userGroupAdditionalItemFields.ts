import { type GQLUserGroup } from "@src/graphql.generated";

const userGroupAdditionalItemFields = {
    userGroup: {
        defaultValue: "All" as GQLUserGroup,
    },
};

export { userGroupAdditionalItemFields };
