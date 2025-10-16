import { type PropsWithData } from "@comet/site-nextjs";
import { type TableBlockData } from "@src/blocks.generated";
import clsx from "clsx";

import styles from "./TableBlock.module.scss";

// TODO: Used for debugging - either remove this or implement properly before merging feature branch
export const TableBlock = ({ data }: PropsWithData<TableBlockData>) => {
    return (
        <div>
            <pre className={styles.debugData}>{JSON.stringify(data, null, 2)}</pre>
            <table border={0} cellPadding={10} cellSpacing={1} className={styles.table}>
                <tbody>
                    {data.rows.map(({ cellValues, ...rowData }) => (
                        <tr key={rowData.id} className={styles.tableRow}>
                            {data.columns.map((column) => {
                                const columnIsHighlighted = column.highlighted;
                                const rowIsHighlighted = rowData.highlighted;

                                return (
                                    <td
                                        key={column.id}
                                        className={clsx([
                                            styles.cell,
                                            columnIsHighlighted && styles["cell--columnIsHighlighted"],
                                            rowIsHighlighted && styles["cell--rowIsHighlighted"],
                                        ])}
                                    >
                                        <p className={styles.cell__text}>{cellValues.find(({ columnId }) => columnId === column.id)?.value}</p>
                                        <pre className={styles.cell__debugData}>
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
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
