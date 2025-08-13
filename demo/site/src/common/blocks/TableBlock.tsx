import { type PropsWithData } from "@comet/site-nextjs";
import { type TableBlockData } from "@src/blocks.generated";

// TODO: Used for debugging - either remove this or implement properly before merging feature branch
export const TableBlock = ({ data }: PropsWithData<TableBlockData>) => {
    return (
        <div>
            <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>{JSON.stringify(data, null, 2)}</pre>
            <table border={1} cellPadding={10} cellSpacing={2}>
                <tbody>
                    {data.rows.map(({ cellValues, ...rowData }) => (
                        <tr key={rowData.id}>
                            {data.columns.map((column) => (
                                <td key={column.id}>
                                    <p style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
                                        {cellValues.find(({ columnId }) => columnId === column.id)?.value}
                                    </p>
                                    <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>
                                        {JSON.stringify(
                                            {
                                                row: rowData,
                                                col: data.columns.find((c) => c.id === column.id),
                                            },
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
