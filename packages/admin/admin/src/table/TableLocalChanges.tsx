import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";
import * as React from "react";

import { DirtyHandlerApiContext } from "../DirtyHandlerApiContext";

export async function submitChangesWithMutation(options: {
    changes: { [id: string]: object };
    variables?: object;
    updateMutation: DocumentNode;
    client: ApolloClient<any>;
}) {
    for (const id of Object.keys(options.changes)) {
        await options.client.mutate({
            mutation: options.updateMutation,
            variables: {
                ...(options.variables || {}),
                id,
                body: options.changes[id],
            },
        });
    }
}

export interface ITableLocalChangesApi {
    setLocalDataChange: (id: string, column: string, value: any) => void;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    submitLocalDataChanges: () => void;
}
interface IProps<TData> {
    data: TData[];
    onSubmit: (changes: { [id: string]: Partial<TData> }) => Promise<void>;
    orderColumn: string;
    children: (injectedProps: {
        tableLocalChangesApi: ITableLocalChangesApi;
        localChangesCount: number;
        data: TData[];
        loading: boolean;
    }) => React.ReactNode;
}
interface IState<TData> {
    changedOrder: string[] | null;
    changes: {
        [id: string]: Partial<TData>;
    };
    loading: boolean;
}
export class TableLocalChanges<TData extends { id: string; [key: string]: any }> extends React.Component<IProps<TData>, IState<TData>> {
    public static contextType = DirtyHandlerApiContext;
    protected static defaultProps = {
        orderColumn: "pos",
    };
    private tableLocalChangesApi: ITableLocalChangesApi;

    constructor(props: IProps<TData>) {
        super(props);
        this.tableLocalChangesApi = {
            setLocalDataChange: this.setLocalDataChange.bind(this),
            moveRow: this.moveRow.bind(this),
            submitLocalDataChanges: this.submitLocalDataChanges.bind(this),
        };
        this.state = {
            changes: {},
            changedOrder: null,
            loading: false,
        };
    }

    public componentDidMount() {
        // register with the parent DirtyHandler
        // probably this needs to be configurable?
        const dirtyApi = this.context ? this.context.getParent() : undefined;
        if (dirtyApi) {
            dirtyApi.registerBinding(this, {
                isDirty: () => {
                    if (Object.keys(this.state.changes).length > 0) return true;
                    if (this.state.changedOrder) return true;
                    return false;
                },
                submit: () => {
                    return this.submitLocalDataChanges();
                },
                reset: () => {
                    this.setState({
                        changes: {},
                        changedOrder: null,
                    });
                },
            });
        }
    }

    public componentWillUnmount() {
        const dirtyApi = this.context ? this.context.getParent() : undefined;
        if (dirtyApi) {
            dirtyApi.unregisterBinding(this);
        }
    }

    public render() {
        let patchedData = this.patchedData();
        if (this.state.changedOrder) {
            patchedData = this.state.changedOrder.map((id) => {
                return patchedData.find((i) => i.id === id);
            });
        }
        return (
            <>
                {this.props.children({
                    tableLocalChangesApi: this.tableLocalChangesApi,
                    localChangesCount: Object.keys(this.state.changes).length,
                    data: patchedData,
                    loading: this.state.loading,
                })}
            </>
        );
    }

    private patchedData() {
        return this.props.data.map((i) => {
            return { ...(i as any), ...(this.state.changes[i.id] as any) };
        });
    }

    private setLocalDataChange<K extends keyof TData>(id: string, column: K, value: TData[K]) {
        const changes = { ...this.state.changes };
        if (!changes[id]) changes[id] = {};

        this.props.data.find((i) => i.id === id);
        const row = this.props.data.find((i) => i.id === id);

        if (row) {
            if (value === row[column]) {
                delete changes[id][column];
                if (Object.keys(changes[id]).length === 0) {
                    delete changes[id];
                }
            } else {
                changes[id][column] = value;
            }
            this.setState({
                changes,
            });
        }
    }

    private moveRow(dragIndex: number, hoverIndex: number) {
        const changedOrder = this.state.changedOrder ? [...this.state.changedOrder] : this.props.data.map((i) => i.id);

        const patchedData = this.patchedData();
        const dragId = changedOrder[dragIndex];

        const hoverId = changedOrder[hoverIndex];
        const hoverRow = patchedData.find((i) => i.id === hoverId);
        this.setLocalDataChange(dragId, this.props.orderColumn, hoverRow[this.props.orderColumn]);

        changedOrder.splice(dragIndex, 1);
        changedOrder.splice(hoverIndex, 0, dragId);
        this.setState({
            changedOrder,
        });
    }

    private async submitLocalDataChanges() {
        // TODO show progress and errors somewhere
        this.setState({
            loading: true,
        });
        this.props.onSubmit(this.state.changes);
        this.setState({
            loading: false,
            changes: {},
            changedOrder: null,
        });
    }
}
