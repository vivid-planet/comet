import { parsePreviewParams, SitePreviewPage } from "@comet/cms-site";
import Page, { createGetUniversalProps, PageUniversalProps } from "@src/pages/[[...path]]";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";

export default function AuthenticatedPreviewPage(props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
    return (
        <SitePreviewPage>
            <Page {...props} />
        </SitePreviewPage>
    );
}

export const getServerSideProps: GetServerSideProps<PageUniversalProps> = async (context: GetServerSidePropsContext) => {
    const { includeInvisibleBlocks } = parsePreviewParams(context.query);
    const getUniversalProps = createGetUniversalProps({
        includeInvisiblePages: true,
        includeInvisibleBlocks,
        previewDamUrls: true,
    });
    return getUniversalProps(context);
};
