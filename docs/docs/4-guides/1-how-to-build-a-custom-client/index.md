---
title: How to build a custom client
---

We usually use [next.js](https://nextjs.org/) to build our site client. This guide will show you how to build a custom client for your Comet DXP and render a typical content page from the page tree.

### Page Tree Node List

To load/see all page tree node's, you need to query the `pageTreeNodeList` field in the `Query` type. This field allows you to fetch a list of `PageTreeNode` objects based on specific criteria such as `contentScope` and `category`. Those values differ from project to project and are defined by the project's requirements. There is also another query `paginatedPageTreeNodes` which is more performant for large page trees.

A Sample Page tree list can look like this:

![Sample Page Tree List](images/sample-page-tree-list.png)

The following example demonstrates how to query all page tree nodes and access their IDs, names, paths, and other relevant fields using fragments.

To fetch all `PageTreeNode` objects and access their IDs, we will use the following query:

```graphql
query Pages($contentScope: PageTreeNodeScopeInput!, $category: String!) {
    pageTreeNodeList(scope: $contentScope, category: $category) {
        id
        name
        path
        slug
    }
}
```

A Response will then look similar to this:

```graphql
{
  "data": {
    "pageTreeNodeList": [
      {
        "id": "7c151a7f-7e0c-4103-8d34-216421f4cdcf",
        "name": "test",
        "path": "/test",
        "slug": "test"
      }
    ]
  }
}
```

With that information in place we can now query the page content, based on the pageTreeNode id.

## Working with the Comet's GraphQL API

The following example demonstrates a Content Page that includes a `HeadlineBlock`, `ImageBlock`, `RichTextBlock`, and a `ColumnBlock` containing two `ImageBlock` elements.

![Sample Content Page](images/sample-content-page.png)

### Loading page data from the API

As said before, we are working with page content that are attached to a page tree node. The page tree is a hierarchical structure that contains all the pages in the system. Each page has an `id` that can be used to fetch the page data from the API.

> **Note:** Blocks can be also be attached to other data (e.g. structured data, news, ...), loading and rendering will be similar, but also a bit different according to the use case.

To fetch the corresponding data we will make use of the `pageTreeNode` field in the `Query` type. The `pageTreeNode` field returns a PageTreeNode object that contains the necessary page data.

> _graphql.schema_

```graphql
type Query {
    pageTreeNode(id: ID!): PageTreeNode
}

type PageTreeNode {
    id: ID!
    path: String!
    document: PageContentUnion
}

union PageContentUnion = Page | Link # The PageContent Union can contain many more entries, we are focusing now on the Page type.
type Page implements DocumentInterface {
    id: ID!
    content: PageContentBlockData!
}

scalar PageContentBlockData
    @specifiedBy(url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf")
```

To query the page data we can use the following query:

```graphql
query Page($id: ID!) {
    pageTreeNode(id: $id) {
        id
        path
        document {
            ... on Page {
                content
            }
        }
    }
}
```

There is also another way of querying page tree node data, based on the path of the page tree node (`pageTreeNodeByPath`). This can be useful if you have the path of the page tree node and not the id.

The received `content` field is a root block and from type `PageContentBlockData` and is a CometDXP Scalar `PageContentBlockData` what is basically a JSONObject that contains the block data.

<details>
<summary>Full Sample Response</summary>

```json
{
    "data": {
        "pageTreeNode": {
            "id": "7c151a7f-7e0c-4103-8d34-216421f4cdcf",
            "path": "/test",
            "document": {
                "content": {
                    "blocks": [
                        {
                            "key": "9d261397-6d62-4d6e-8934-0b627f4af4e4",
                            "visible": true,
                            "type": "headline",
                            "props": {
                                "eyebrow": "",
                                "headline": {
                                    "draftContent": {
                                        "blocks": [
                                            {
                                                "key": "8i42j",
                                                "text": "Lorem ipsum",
                                                "type": "unstyled",
                                                "depth": 0,
                                                "inlineStyleRanges": [],
                                                "entityRanges": [],
                                                "data": {}
                                            }
                                        ],
                                        "entityMap": {}
                                    }
                                },
                                "level": "header-one"
                            },
                            "userGroup": "All"
                        },
                        {
                            "key": "83a341d4-723c-422f-beea-5d3b1a31a10c",
                            "visible": true,
                            "type": "image",
                            "props": {
                                "attachedBlocks": [],
                                "block": {
                                    "type": "pixelImage",
                                    "props": {
                                        "damFile": {
                                            "id": "59d72281-9ae9-4351-b37b-6efc01a54842",
                                            "name": "aerial-photo-of-mountains-1632044.jpg",
                                            "size": "6412063",
                                            "mimetype": "image/jpeg",
                                            "contentHash": "4c16d34b98b993a8864a599cbbd419e0",
                                            "title": null,
                                            "altText": null,
                                            "archived": false,
                                            "scope": {
                                                "domain": "main"
                                            },
                                            "importSourceId": null,
                                            "importSourceType": null,
                                            "image": {
                                                "width": 6000,
                                                "height": 4000,
                                                "cropArea": {
                                                    "focalPoint": "SMART",
                                                    "width": null,
                                                    "height": null,
                                                    "x": null,
                                                    "y": null
                                                },
                                                "dominantColor": "#324f63"
                                            }
                                        },
                                        "urlTemplate": "http://localhost:4000/dam/images/067e080ba5e484cde929c866d5d26814bead1b58/59d72281-9ae9-4351-b37b-6efc01a54842/crop:SMART/resize:$resizeWidth:$resizeHeight/aerial-photo-of-mountains-1632044"
                                    }
                                },
                                "activeType": "pixelImage"
                            },
                            "userGroup": "All"
                        },
                        {
                            "key": "bdf6c7be-a1cc-4f83-85be-16a221d94eb2",
                            "visible": true,
                            "type": "richtext",
                            "props": {
                                "draftContent": {
                                    "blocks": [
                                        {
                                            "key": "9uhi2",
                                            "text": "Lorem ipsum ...",
                                            "type": "unstyled",
                                            "depth": 0,
                                            "inlineStyleRanges": [],
                                            "entityRanges": [],
                                            "data": {}
                                        },
                                        {
                                            "key": "adu0d",
                                            "text": "",
                                            "type": "unstyled",
                                            "depth": 0,
                                            "inlineStyleRanges": [],
                                            "entityRanges": [],
                                            "data": {}
                                        },
                                        {
                                            "key": "8t7f1",
                                            "text": "Lorem ipsum ...",
                                            "type": "unstyled",
                                            "depth": 0,
                                            "inlineStyleRanges": [],
                                            "entityRanges": [],
                                            "data": {}
                                        }
                                    ],
                                    "entityMap": {}
                                }
                            },
                            "userGroup": "All"
                        },
                        {
                            "key": "6f49d864-3225-4549-a539-0678f1c5195e",
                            "visible": true,
                            "type": "columns",
                            "props": {
                                "layout": "two-columns",
                                "columns": [
                                    {
                                        "key": "6d1e7395-f460-4c5a-9be5-b046dea61ad4",
                                        "visible": true,
                                        "props": {
                                            "blocks": [
                                                {
                                                    "key": "0b0fbb35-64cf-47e5-a28f-993c792be28a",
                                                    "visible": true,
                                                    "type": "image",
                                                    "props": {
                                                        "attachedBlocks": [],
                                                        "block": {
                                                            "type": "pixelImage",
                                                            "props": {
                                                                "damFile": {
                                                                    "id": "faac8d30-74ed-4818-9cdb-883ef3c3399f",
                                                                    "name": "scenic-photo-of-lake-during-dawn-4124074.jpg",
                                                                    "size": "5342794",
                                                                    "mimetype": "image/jpeg",
                                                                    "contentHash": "eb44dccb21566f10560b6650a7fd9de5",
                                                                    "title": null,
                                                                    "altText": null,
                                                                    "archived": false,
                                                                    "scope": {
                                                                        "domain": "main"
                                                                    },
                                                                    "importSourceId": null,
                                                                    "importSourceType": null,
                                                                    "image": {
                                                                        "width": 6000,
                                                                        "height": 4000,
                                                                        "cropArea": {
                                                                            "focalPoint": "SMART",
                                                                            "width": null,
                                                                            "height": null,
                                                                            "x": null,
                                                                            "y": null
                                                                        },
                                                                        "dominantColor": "#3f3e26"
                                                                    }
                                                                },
                                                                "urlTemplate": "http://localhost:4000/dam/images/8469b5607c52ad0a2f7760191812372072649a8e/faac8d30-74ed-4818-9cdb-883ef3c3399f/crop:SMART/resize:$resizeWidth:$resizeHeight/scenic-photo-of-lake-during-dawn-4124074"
                                                            }
                                                        },
                                                        "activeType": "pixelImage"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "key": "65da0978-1f56-4d41-92e8-9404c30ca29a",
                                        "visible": true,
                                        "props": {
                                            "blocks": [
                                                {
                                                    "key": "427fb0a9-949d-46ce-a4f2-5438ec583cd8",
                                                    "visible": true,
                                                    "type": "image",
                                                    "props": {
                                                        "attachedBlocks": [],
                                                        "block": {
                                                            "type": "pixelImage",
                                                            "props": {
                                                                "damFile": {
                                                                    "id": "c87dafdf-d21c-4b1b-a956-9caf20434d2d",
                                                                    "name": "adventure-alpine-altitude-austria-355241.jpg",
                                                                    "size": "1739404",
                                                                    "mimetype": "image/jpeg",
                                                                    "contentHash": "b4622b2d3b71364a3d7d19e906136409",
                                                                    "title": null,
                                                                    "altText": null,
                                                                    "archived": false,
                                                                    "scope": {
                                                                        "domain": "main"
                                                                    },
                                                                    "importSourceId": null,
                                                                    "importSourceType": null,
                                                                    "image": {
                                                                        "width": 4608,
                                                                        "height": 2592,
                                                                        "cropArea": {
                                                                            "focalPoint": "SMART",
                                                                            "width": null,
                                                                            "height": null,
                                                                            "x": null,
                                                                            "y": null
                                                                        },
                                                                        "dominantColor": "#6883a1"
                                                                    }
                                                                },
                                                                "urlTemplate": "http://localhost:4000/dam/images/4cf3ef037210cc779fe257a70dd8079277e97cac/c87dafdf-d21c-4b1b-a956-9caf20434d2d/crop:SMART/resize:$resizeWidth:$resizeHeight/adventure-alpine-altitude-austria-355241"
                                                            }
                                                        },
                                                        "activeType": "pixelImage"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "userGroup": "All"
                        }
                    ]
                }
            }
        }
    }
}
```

</details>

The data in the `content` field is a so called `RootBlock`, the `Page` document, can have multiple root blocks. Another `RootBlock`, which is not requested in this example would be the `seo` field. This `RootBlock` will contain all the necessary and available SEO data of the page in the block data structure.

The following JSON structure represents a `HeadlineBlock` in the page content. This block is used to display a headline with optional additional text (eyebrow) and a specific headline level.

Example:

```json
{
    "key": "9d261397-6d62-4d6e-8934-0b627f4af4e4",
    "visible": true,
    "type": "headline",
    "props": {
        "eyebrow": "",
        "headline": {
            "draftContent": {
                "blocks": [
                    {
                        "key": "8i42j",
                        "text": "Lorem ipsum",
                        "type": "unstyled",
                        "depth": 0,
                        "inlineStyleRanges": [],
                        "entityRanges": [],
                        "data": {}
                    }
                ],
                "entityMap": {}
            }
        },
        "level": "header-one"
    },
    "userGroup": "All"
}
```

**Block structure**

- `key`: A unique identifier for the block.
- `visible`: A boolean indicating whether the block is visible.
- `type`: The type of the block, in this case, "headline".
- `props`: An object containing the block-specific data:
    - `eyebrow`: An optional string for additional text above the headline.
    - `headline`: An object containing the `draftContent`, which is a rich text structure:
    - `level`: The level of the headline, e.g., "header-one".
- `userGroup`: Specifies the user group that can view the block, e.g., "All".

There are some special Block Types (`BlocksBlock`, `ColumnsBlock`, `LinkBlock`, `ListBlock`, `OneOfBlock`, `OptionalBlock`, `RichTextBlock` and more). More details can be found in the [Block Factories](/docs/core-concepts/blocks/factories) section.

Due to the nature that each block can have a different structure, we need to handle each block type individually and implement the rendering logic for each block type.

The whole graphQL API is typesafe, but the block data gets delivered as an untyped JSON structure. That's because in the nature of graphQL, because it's not possible to deliver recursive structures at any level. Therefor Comet DXP offers a solution. We call this `BlockMeta` solution.

The Comet API creates this `block-meta.json` and this file gets symlinked to the `admin` and `site` services. The `block-meta.json` contains all the necessary information about the block types. If the `api` gets developed independently of the `site`a symlink is not possible. The `block-meta.json` can be provided as a separate endpoint in the api.

`@comet/cli` provides a command to generate the available typescript types, based on a `block-meta.json` file.

> package.json

```json
{
    "scripts": {
        "generate-block-types": "comet generate-block-types",
        "generate-block-types:watch": "chokidar -s \"block-meta.json\" -c \"npm run generate-block-types\""
    }
}
```

With those tools in place, typescript files can be generated for the block data, and will be placed in `./src/blocks.generated.ts` directory

> blocks.generated.ts

```typescript
export interface PageContentBlockData {
  blocks: Array<{
    key: string;
    visible: boolean;
    type: string;
    props:
            | DemoSpaceBlockData
            | RichTextBlockData
            | HeadlineBlockData
            | DamImageBlockData
            | TextImageBlockData
            | LinkListBlockData
            | FullWidthImageBlockData
            | ColumnsBlockData
            | AnchorBlockData
            | TwoListsBlockData
            | MediaBlockData
            | TeaserBlockData
            | NewsDetailBlockData
            | ImageLinkBlockData
            | NewsListBlockData
            | LayoutBlockData;
    userGroup: "All" | "Admin" | "User";
  }>;
}

export interface HeadlineBlockData {
  eyebrow?: string;
  headline: RichTextBlockData;
  level: "header-one" | "header-two" | "header-three" | "header-four" | "header-five" | "header-six";
}

# and other block data interfaces
```

## Render blocks

Having the block data in place, we can now render the blocks. The rendering logic for each block type is recommended to be implemented in a separate component. Here as an example the [HeadlineBlock from Comet Demo](https://github.com/vivid-planet/comet/blob/a737ccc2f0826b236b49d63129a6a49e7f790993/demo/site/src/blocks/HeadlineBlock.tsx#L36) component.

Having all the block components implemented, we can now start to render the page content.
Typically a page consists of a list of blocks, those `BlocksBlock` can be rendered with a component [BlocksBlock](/docs/core-concepts/blocks/factories#site). from the `@comet/site-nextjs` package.

```typescript
import { BlocksBlock, PropsWithData, SupportedBlocks } from "@comet/site-nextjs";
import { PageContentBlockData } from "@src/blocks.generated";

const supportedBlocks: SupportedBlocks = {
    heading: (props) => <HeadlineBlock data={props} />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
```

## Handle preview

More Information how to integrate and work with Comet Admin's Preview can be found in the IFrameBridge section.

# Further Reading / Information

- [Comet Starter - Next Site - Blueprint for new Comet Projects](https://github.com/vivid-planet/comet-starter/tree/main/site)
- [Comet Starter - Page Tree Node Query](https://github.com/vivid-planet/comet-starter/blob/main/site/src/documents/pages/Page.tsx)
- [Comet Starter - Rendering blocks with Blocks Block](https://github.com/vivid-planet/comet-starter/blob/main/site/src/documents/pages/blocks/PageContentBlock.tsx)
