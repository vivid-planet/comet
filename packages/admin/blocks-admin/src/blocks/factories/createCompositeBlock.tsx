import { StackPage, StackSwitch, StackSwitchApiContext, SubRoute, useSubRoutePrefix } from "@comet/admin";
import { Divider } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { HoverPreviewComponent } from "../../iframebridge/HoverPreviewComponent";
import { AdminComponentNestedButton } from "../common/AdminComponentNestedButton";
import { AdminComponentPaper, useAdminComponentPaper } from "../common/AdminComponentPaper";
import { AdminComponentSection } from "../common/AdminComponentSection";
import { AdminComponentSectionGroup } from "../common/AdminComponentSectionGroup";
import { HiddenInSubroute } from "../common/HiddenInSubroute";
import { composeBlocks, CompositeBlockInterface } from "../helpers/composeBlocks/composeBlocks";
import { BlockInterfaceWithOptions } from "../helpers/composeBlocks/types";
import { normalizedBlockConfig } from "../helpers/composeBlocks/utils";
import { createBlockSkeleton } from "../helpers/createBlockSkeleton";
import { isBlockInterface } from "../helpers/isBlockInterface";
import { BlockCategory, BlockInputApi, BlockInterface, BlockOutputApi, BlockState, CustomBlockCategory } from "../types";

interface BlockConfiguration {
    title?: React.ReactNode;
    nested?: boolean;
    block: BlockInterface | BlockInterfaceWithOptions;
    hiddenInSubroute?: boolean;
    divider?: boolean;
    paper?: boolean;
}

interface GroupConfiguration {
    blocks: Record<string, BlockConfiguration>;
    title?: React.ReactNode;
    paper?: boolean;
}

interface NormalizedBlockConfiguration extends BlockConfiguration {
    block: BlockInterfaceWithOptions;
}

interface CreateCompositeBlockOptionsBase {
    name: string;
    displayName: React.ReactNode;
    /**
     * @deprecated Use override instead to adapt the factored block
     */
    category?: BlockCategory | CustomBlockCategory;
    adminLayout?: "stacked";
    blocks: Record<string, BlockConfiguration>;
}

type CreateCompositeBlockOptionsWithGroups = Omit<CreateCompositeBlockOptionsBase, "blocks"> & { groups: Record<string, GroupConfiguration> };

type CreateCompositeBlockOptions = CreateCompositeBlockOptionsBase | CreateCompositeBlockOptionsWithGroups;

const hasGroups = (options: CreateCompositeBlockOptions): options is CreateCompositeBlockOptionsWithGroups => "groups" in options;

type ExtractCompositeBlocksConfigBase<T extends Record<string, { block: BlockInterface | BlockInterfaceWithOptions }>> = {
    [K in keyof T]: T[K]["block"];
};

// Inspired by https://dev.to/lucianbc/union-type-merging-in-typescript-9al
type ExtractGroupConfigs<T extends Record<string, GroupConfiguration>> = T[keyof T];
type AllBlockKeys<T> = T extends Record<string, BlockConfiguration> ? keyof T : never;
type MergeBlockConfigs<T extends Record<string, BlockConfiguration>> = {
    [BlockKey in AllBlockKeys<T>]: NonNullable<ExtractBlockConfig<T, BlockKey>>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PickType<T, K extends AllBlockKeys<T>> = T extends { [k in K]?: any } ? T[K] : undefined;
type ExtractBlockConfig<T extends Record<string, BlockConfiguration>, K extends AllBlockKeys<T>> = PickType<T, K>;

type ExtractCompositeBlocksConfig<Options extends CreateCompositeBlockOptions> = Options extends CreateCompositeBlockOptionsWithGroups
    ? ExtractCompositeBlocksConfigBase<MergeBlockConfigs<ExtractGroupConfigs<Options["groups"]>["blocks"]>>
    : Options extends CreateCompositeBlockOptionsBase
    ? ExtractCompositeBlocksConfigBase<Options["blocks"]>
    : never;

export const createCompositeBlock = <Options extends CreateCompositeBlockOptions>(
    options: Options,
    override?: (
        block: CompositeBlockInterface<ExtractCompositeBlocksConfig<Options>>,
    ) => CompositeBlockInterface<ExtractCompositeBlocksConfig<Options>>,
): CompositeBlockInterface<ExtractCompositeBlocksConfig<Options>> => {
    const { name, displayName, category = BlockCategory.Other } = options;

    let groups: Record<string, GroupConfiguration>;

    if (hasGroups(options)) {
        groups = options.groups;
    } else {
        // TODO blocks-admin won't build without this (unnecessary) explicit cast
        groups = { default: { blocks: (options as CreateCompositeBlockOptionsBase).blocks } };
    }

    const blockConfigs: Record<string, BlockConfiguration> = Object.values(groups).reduce((blocks, group) => ({ ...blocks, ...group.blocks }), {});

    // internally use the lower level composeBlocks-api
    const {
        api: { adminComponents, childBlockCounts, isValids, previews },
        block,
    } = composeBlocks<ExtractCompositeBlocksConfig<Options>>(
        Object.entries(blockConfigs).reduce(
            (a, [key, { block }]) => ({
                ...a,
                [key]: block,
            }),
            {} as ExtractCompositeBlocksConfig<Options>,
        ),
    );

    // for easier usage, make sure each blockConfig has the same shape (BlockInterfaceWithOptions)
    const blockConfigNormalized = Object.entries(blockConfigs).reduce((acc, [key, value]) => {
        return { ...acc, [key]: { ...value, block: normalizedBlockConfig(value.block) } };
    }, {} as Record<string, NormalizedBlockConfiguration>);

    const CompositeBlock: BlockInterface<BlockInputApi<typeof block>, BlockState<typeof block>, BlockOutputApi<typeof block>> = {
        ...createBlockSkeleton(),
        ...block, // merge in the blockMethods provided by the composeBlocks-api

        name,

        displayName,

        category,

        createPreviewState: (state, previewContext) => {
            const blockPreviewState = block.createPreviewState(state, previewContext);

            Object.entries(blockConfigNormalized).forEach(([attr, block]) => {
                const [extractedBlock] = block.block;
                if (block.nested === true && isBlockInterface(extractedBlock)) {
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    const blockState: any = (state as any)[attr];

                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    (blockPreviewState as any)[attr] = extractedBlock.createPreviewState(blockState, {
                        ...previewContext,
                        parentUrl: `${previewContext.parentUrlSubRoute ?? previewContext.parentUrl}/${attr}/${attr}`,
                    });
                } else if ((block.nested == null || !block.nested) && isBlockInterface(extractedBlock)) {
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    const blockState: any = (state as any)[attr];

                    const embeddedBlockState = extractedBlock.createPreviewState(blockState, {
                        ...previewContext,
                        parentUrlSubRoute: `${previewContext.parentUrl}/${attr}`,
                        parentUrl: `${previewContext.parentUrl}`,
                    });
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    (blockPreviewState as any)[attr] = { ...embeddedBlockState, adminMeta: { route: `${previewContext.parentUrl}#${attr}` } };
                }
            });
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            return { ...(blockPreviewState as any), adminMeta: { route: previewContext.parentUrl } };
        },
        AdminComponent: ({ state, updateState }) => {
            const urlPrefix = useSubRoutePrefix();
            const isInPaper = useAdminComponentPaper();
            const blockAdminComponents = adminComponents({ state, updateState });
            const blockPreviews = previews(state);
            const blockChildBlockCounts = childBlockCounts(state);
            const blockIsValids = isValids(state);

            const nestedBlocks = Object.entries(blockConfigNormalized).filter(([, { nested }]) => nested === true);

            const renderBlock = (blockKey: string, group: GroupConfiguration) => {
                const {
                    block: [block],
                    title,
                    nested,
                    hiddenInSubroute,
                    divider,
                    paper,
                } = blockConfigNormalized[blockKey];

                const sectionVariant = group.paper ? "dense" : "normal";
                const showDivider = divider && (isInPaper || group.paper);

                let children: React.ReactNode;

                if (nested) {
                    children = (
                        <StackSwitchApiContext.Consumer>
                            {(stackApi) => (
                                <HoverPreviewComponent key={blockKey} componentSlug={`${blockKey}/${blockKey}`}>
                                    <AdminComponentNestedButton
                                        displayName={
                                            isBlockInterface(block) ? (
                                                block.displayName
                                            ) : (
                                                <FormattedMessage id="comet.blocks.createCompositeBlock.settings" defaultMessage="Settings" />
                                            )
                                        }
                                        preview={blockPreviews[blockKey]}
                                        count={blockChildBlockCounts[blockKey]}
                                        onClick={() => stackApi.activatePage(blockKey, blockKey)}
                                        isValid={blockIsValids[blockKey]}
                                    />
                                </HoverPreviewComponent>
                            )}
                        </StackSwitchApiContext.Consumer>
                    );
                } else {
                    children = (
                        <HoverPreviewComponent key={blockKey} componentSlug={`#${blockKey}`}>
                            <SubRoute path={`${urlPrefix}/${blockKey}`}>{blockAdminComponents[blockKey]}</SubRoute>
                        </HoverPreviewComponent>
                    );
                }

                const Container = nested || hiddenInSubroute ? HiddenInSubroute : React.Fragment;

                if (paper) {
                    return (
                        <Container key={blockKey}>
                            <AdminComponentSection
                                title={block.definesOwnTitle ? null : title}
                                variant={sectionVariant}
                                disableBottomMargin={showDivider}
                            >
                                <AdminComponentPaper disablePadding={block.definesOwnPadding}>{children}</AdminComponentPaper>
                            </AdminComponentSection>
                        </Container>
                    );
                }

                return (
                    <Container key={blockKey}>
                        <AdminComponentSection
                            title={block.definesOwnTitle ? null : title}
                            variant={sectionVariant}
                            disableBottomMargin={showDivider}
                        >
                            {children}
                        </AdminComponentSection>
                        {showDivider && <Divider />}
                    </Container>
                );
            };

            return (
                <StackSwitch>
                    {[
                        <StackPage name="initial" key="initial">
                            {Object.entries(groups).map(([groupKey, group]) => {
                                const { title, paper, blocks } = group;
                                const children = Object.keys(blocks).map((blockKey) => (
                                    <React.Fragment key={blockKey}>{renderBlock(blockKey, group)}</React.Fragment>
                                ));

                                const hiddenInSubroute = Object.values(blocks).every(
                                    (blockConfig) => blockConfig.hiddenInSubroute || blockConfig.nested,
                                );

                                const Container = hiddenInSubroute ? HiddenInSubroute : React.Fragment;

                                if (paper) {
                                    const definesOwnPadding = Object.values(blocks).every((blockConfig) => {
                                        const [blockInterface] = normalizedBlockConfig(blockConfig.block);
                                        return blockInterface.definesOwnPadding;
                                    });

                                    return (
                                        <Container key={groupKey}>
                                            <AdminComponentSectionGroup title={title}>
                                                <AdminComponentPaper disablePadding={definesOwnPadding}>{children}</AdminComponentPaper>
                                            </AdminComponentSectionGroup>
                                        </Container>
                                    );
                                }

                                return (
                                    <Container key={groupKey}>
                                        <AdminComponentSectionGroup title={title}>{children}</AdminComponentSectionGroup>
                                    </Container>
                                );
                            })}
                        </StackPage>,
                        ...nestedBlocks.map(([key, { title }]) => {
                            const block = blockConfigNormalized[key].block[0];

                            // @TODO: change literal string "Settings" on next line to: <FormattedMessage id="comet.blocks.createCompositeBlock.settings" defaultMessage="Settings" />
                            // when https://github.com/vivid-planet/comet/pull/340 is fixed
                            return (
                                <StackPage key={key} name={key} title={title ? title : isBlockInterface(block) ? block.displayName : "Settings"}>
                                    {blockAdminComponents[key]}
                                </StackPage>
                            );
                        }),
                    ]}
                </StackSwitch>
            );
        },
        resolveDependencyRoute: (state, jsonPath) => {
            const key = jsonPath.split(".")[0];

            const route = [];

            const childRoute = block.resolveDependencyRoute(state, jsonPath);
            if (blockConfigNormalized[key].nested) {
                route.push(key, key);
            } else if (childRoute.length > 0) {
                route.push(key);
            }

            route.push(childRoute);

            return route.join("/");
        },
    };
    // allows to "fine-tune" the block with the product of the factory as argument
    // @TODO: this override-fn should be the 2nd argument (1st argument are factory-options) in every block factory!
    if (override) {
        return override(CompositeBlock);
    }
    return CompositeBlock;
};
