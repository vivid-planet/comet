# Comet Demo MCP Server

An [MCP](https://modelcontextprotocol.io) server that exposes the Comet demo API's page tree, page content,
and DAM operations as tools and resources over the Model Context Protocol. It lets an MCP client (e.g. Claude
Code, Claude Desktop) read and edit demo CMS content via natural language.

It talks to the demo API over GraphQL, so the demo API must be running and reachable.

The server uses the [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) transport and listens on `http://localhost:3001/mcp` by default.

## Tools

| Tool                               | Description                                             |
| ---------------------------------- | ------------------------------------------------------- |
| `list_page_tree_nodes`             | List page tree nodes in a scope (published only)        |
| `get_page_tree_node`               | Get a single page tree node by ID (published only)      |
| `get_page_tree_node_by_path`       | Look up a page tree node by URL path                    |
| `get_page`                         | Get a page document (content, SEO, stage) by ID         |
| `check_slug_availability`          | Check whether a slug is available under a parent        |
| `create_page_tree_node`            | Create a new page tree node                             |
| `update_page_tree_node`            | Update a node's name, slug, and `hideInMenu`            |
| `save_page`                        | Save page content (content blocks, SEO, stage)          |
| `update_page_tree_node_visibility` | Publish, unpublish, or archive a node                   |
| `list_dam_files`                   | List files in the Digital Asset Management (DAM) system |
| `get_dam_file`                     | Get a single DAM file by ID                             |
| `delete_page_tree_node`            | Permanently delete an archived node and its document    |

## Resources

| Resource      | URI                   | Description                                                          |
| ------------- | --------------------- | -------------------------------------------------------------------- |
| `block-types` | `comet://block-types` | Lightweight TypeScript interfaces for all content blocks (preferred) |
| `block-meta`  | `comet://block-meta`  | Full block schema metadata (field kinds, nullability, enums)         |

## Prerequisites

- The demo API running and reachable (see the repository root [`AGENTS.md`](../../AGENTS.md)).
- `@comet/cli` built (it is built as part of the normal monorepo setup).
- `schema.gql` and `block-meta.json` present in this folder. They are symlinks to `demo/api`, created by the
  root `copy-project-files` script (run automatically during setup, or manually via `pnpm run copy-project-files`).

## Build

From the repository root:

```bash
pnpm --filter comet-demo-mcp-server run build
```

This generates GraphQL types (`gql:types`) and block-type interfaces (`generate-block-types`), then bundles the
server to `dist/index.js` with `tsup`.

## Configuration

The server reads the following environment variables (with development defaults):

| Variable                              | Default                     | Description                             |
| ------------------------------------- | --------------------------- | --------------------------------------- |
| `PORT`                                | `3001`                      | Port the HTTP server listens on         |
| `API_URL`                             | `http://localhost:4000`     | Base URL of the demo API                |
| `API_BASIC_AUTH_SYSTEM_USER_PASSWORD` | `aPasswordWith16Characters` | Password for the basic-auth system user |

> **Warning:** Authentication uses the basic-auth system user, which has full access to the API. This is intended
> for local development and testing only — it is **not** production-ready and must be replaced by a user-based
> authentication method before any non-local use.

## Usage with an MCP client

Start the server first:

```bash
pnpm --filter comet-demo-mcp-server run start
```

It listens on `http://localhost:3001/mcp` (configurable via `PORT`). Then register the running server with
an MCP client that supports the Streamable HTTP transport:

```json
{
    "mcpServers": {
        "comet-demo": {
            "type": "http",
            "url": "http://localhost:3001/mcp"
        }
    }
}
```

The demo API URL and credentials are configured via the server's environment variables (see
[Configuration](#configuration)), not the client.

## Development

- GraphQL operations live next to their tool in `*.gql.ts` files; queries are validated against `schema.gql` at
  build time via GraphQL Code Generator.
- Generated files (`*.generated.ts`, `blocks.generated.ts`), the build output (`dist/`), and the `schema.gql` /
  `block-meta.json` symlinks are git-ignored.

Run linting from the repository root:

```bash
pnpm --filter comet-demo-mcp-server run lint
# auto-fix:
pnpm --filter comet-demo-mcp-server run lint:fix
```
