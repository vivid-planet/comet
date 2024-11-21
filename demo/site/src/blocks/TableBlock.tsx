import { PropsWithData } from "@comet/cms-site";
import { TableBlockData } from "@src/blocks.generated";

// TODO: Used for debugging - either remove this or implement properly before merging feature branch
export const TableBlock = ({ data }: PropsWithData<TableBlockData>) => {
    return (
        <div>
            <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>{JSON.stringify(data, null, 2)}</pre>
            <table border={1} cellPadding={10} cellSpacing={2}>
                <tbody>
                    {data.rows.map(({ cellValues, ...rowData }) => (
                        <tr key={rowData.id}>
                            {cellValues.map((cellValue) => (
                                <td key={cellValue.columnId}>
                                    <p style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>{cellValue.value}</p>
                                    <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>
                                        {JSON.stringify(
                                            {
                                                row: rowData,
                                                col: data.columns.find((c) => c.id === cellValue.columnId),
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
