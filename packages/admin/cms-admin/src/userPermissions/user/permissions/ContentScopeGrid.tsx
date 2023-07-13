import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormCheckbox, SaveButton, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CircularProgress, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLContentScopesQuery,
    GQLContentScopesQueryVariables,
    GQLSetContentScopeMutation,
    GQLSetContentScopeMutationVariables,
} from "./ContentScopeGrid.generated";

interface FormSubmitData {
    [key: string]: Array<string>;
}

export const ContentScopeGrid: React.FC<{
    userId: string;
}> = ({ userId }) => {
    const client = useApolloClient();

    const submit = async (data: FormSubmitData) => {
        await client.mutate<GQLSetContentScopeMutation, GQLSetContentScopeMutationVariables>({
            mutation: gql`
                mutation SetContentScope($input: UserContentScopesInput!) {
                    userPermissionsSetContentScope(input: $input) {
                        userId
                    }
                }
            `,
            variables: {
                input: {
                    userId,
                    scopes: Object.entries(data).map((v) => ({ scope: v[0], values: v[1] })),
                },
            },
            refetchQueries: ["ContentScopes"],
        });
    };

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes {
                    scope
                    label
                    values {
                        label
                        value
                    }
                }
                contentScope: userPermissionsContentScope(userId: $userId) {
                    scopes {
                        scope
                        values
                    }
                }
                contentScopeSkipManual: userPermissionsContentScope(userId: $userId, skipManual: true) {
                    scopes {
                        scope
                        values
                    }
                }
            }
        `,
        {
            variables: { userId },
        },
    );

    if (error) throw new Error(error.message);

    if (!data || !data.contentScope || !data.contentScopeSkipManual) {
        return <CircularProgress />;
    }

    return (
        <Card>
            <FinalForm<FormSubmitData>
                mode="edit"
                onSubmit={submit}
                initialValues={Object.fromEntries(data.contentScope.scopes.map((v) => [v.scope, v.values]))}
            >
                <CardToolbar>
                    <ToolbarTitleItem>
                        <FormattedMessage id="comet.userManagemant.scopes" defaultMessage="Scopes" />
                    </ToolbarTitleItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveButton type="submit">
                            <FormattedMessage id="comet.userPermissions.save" defaultMessage="Save" />
                        </SaveButton>
                    </ToolbarActions>
                </CardToolbar>
                <CardContent>
                    {data.availableContentScopes.map((contentScope) => (
                        <Accordion key={contentScope.scope} expanded={data.availableContentScopes.length < 10}>
                            <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
                                <Box sx={{ flexDirection: "column" }}>
                                    <Typography variant="h5" sx={{ fontWeight: "medium" }}>
                                        {contentScope.label}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <FormattedMessage
                                            id="comet.userPermissions.contentScopesCount"
                                            defaultMessage="{selected} of {count} selected"
                                            values={{
                                                selected:
                                                    data.contentScope.scopes.find((scope) => scope.scope === contentScope.scope)?.values.length ?? 0,
                                                count: contentScope.values.length,
                                            }}
                                        />
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {contentScope.values.map((value) => (
                                    <Field
                                        fieldContainerProps={{ fieldMargin: "never" }}
                                        disabled={data.contentScopeSkipManual.scopes
                                            .find((scope) => scope.scope === contentScope.scope)
                                            ?.values.includes(value.value)}
                                        key={value.value}
                                        name={`${contentScope.scope}`}
                                        variant="horizontal"
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        value={value.value}
                                        label={value.label}
                                    />
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CardContent>
            </FinalForm>
        </Card>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
