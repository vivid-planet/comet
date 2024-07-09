import { parsePreviewParams, SitePreviewPage } from "@comet/cms-site";
import { GQLUserGroup } from "@src/graphql.generated";
import Page, { createGetUniversalProps, PageUniversalProps } from "@src/pages/[[...path]]";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";

export default function AuthenticatedPreviewPage(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    return (
        <SitePreviewPage>
            <>
                <h1>User group: {props.userGroup}</h1>
                <Page {...props} />
            </>
        </SitePreviewPage>
    );
}

declare module "@comet/cms-site" {
    interface SitePreviewParams {
        userGroup: GQLUserGroup;
    }
}

export const getServerSideProps: GetServerSideProps<PageUniversalProps> = async (context: GetServerSidePropsContext) => {
    const { includeInvisibleBlocks, userGroup } = parsePreviewParams(context.query);
    const getUniversalProps = createGetUniversalProps({
        includeInvisiblePages: true,
        includeInvisibleBlocks,
        previewDamUrls: true,
        userGroup,
    });
    return getUniversalProps(context);
};
