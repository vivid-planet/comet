---
"@comet/blocks-admin": minor
"@comet/cms-admin": minor
"@comet/cms-site": minor
---

Pass the `graphQLApiUrl` for `useBlockPreviewFetch` through the `IFrameBridge`

It's not necessary to set it in the site anymore. To migrate, remove the argument from `useBlockPreviewFetch()`:

```diff
const PreviewPage = () => {
    const iFrameBridge = useIFrameBridge();

-   const { fetch, graphQLFetch } = useBlockPreviewFetch(graphQLApiUrl);
+   const { fetch, graphQLFetch } = useBlockPreviewFetch();

    const [blockData, setBlockData] = useState<PageContentBlockData>();
    useEffect(() => {
        async function load() {
+           if (!graphQLFetch) {
+               return;
+           }
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            const newData = await recursivelyLoadBlockData({
                blockType: "PageContent",
                blockData: iFrameBridge.block,
                graphQLFetch,
                fetch,
                pageTreeNodeId: undefined, //we don't have a pageTreeNodeId in preview
            });
            setBlockData(newData);
        }
        load();
    }, [iFrameBridge.block, fetch, graphQLFetch]);

    return <div>{blockData && <PageContentBlock data={blockData} />}</div>;
};
```
