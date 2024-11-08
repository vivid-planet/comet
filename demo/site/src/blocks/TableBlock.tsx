import { PropsWithData } from "@comet/cms-site";
import { TableBlockData } from "@src/blocks.generated";

// TODO: Used for debugging - either remove this or implement properly before merging feature branch
export const TableBlock = ({ data }: PropsWithData<TableBlockData>) => {
    return (
        <div>
            <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>{JSON.stringify(data, null, 2)}</pre>
            <table border={1} cellPadding={10} cellSpacing={2}>
                {data.rows.map(({ columnValues, ...rowData }) => (
                    <tr key={rowData.id}>
                        {columnValues.map((columnValue) => (
                            <td key={columnValue.columnId}>
                                <p style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>{columnValue.value}</p>
                                <pre style={{ fontSize: 9, lineHeight: 1, backgroundColor: "lightgrey", padding: 10 }}>
                                    {JSON.stringify(
                                        {
                                            row: rowData,
                                            col: data.columns.find((c) => c.id === columnValue.columnId),
                                        },
                                        null,
                                        2,
                                    )}
                                </pre>
                            </td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
    );
};
