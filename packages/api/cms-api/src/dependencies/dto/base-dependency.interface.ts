export interface BaseDependencyInterface {
    rootId: string;
    rootEntityName: string;
    rootTableName: string;
    rootPrimaryKey: string;
    rootGraphqlObjectType: string;
    rootColumnName: string;
    blockname: string;
    jsonPath: string;
    visible: boolean;
    targetEntityName: string;
    targetGraphqlObjectType: string;
    targetTableName: string;
    targetPrimaryKey: string;
    targetId: string;
}
