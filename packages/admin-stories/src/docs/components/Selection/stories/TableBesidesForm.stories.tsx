// import { DirtyHandler, Selected, TableQuery, useSelectionRoute, useTableQuery } from "@comet/admin";
// import { Grid } from "@material-ui/core";
// import { storiesOf } from "@storybook/react";
// import * as React from "react";
//
// import { apolloStoryDecorator } from "../../../../apollo-story.decorator";
// import { storyRouterDecorator } from "../../../../story-router.decorator";
// import { ExampleForm } from "./helpers/ExampleForm";
// import { ExampleTable } from "./helpers/ExampleTable";
// import { UserQueryData, usersQuery } from "./helpers/user.gql";
//
// storiesOf("stories/components/Selection/useSelectionRoute", module)
//     .addDecorator(apolloStoryDecorator())
//     .addDecorator(storyRouterDecorator())
//     .add("useSelectionRoute", () => {
//         const [Selection, selection, selectionApi] = useSelectionRoute();
//         const { tableData, api, loading, error } = useTableQuery<UserQueryData, {}>()(usersQuery, {
//             resolveTableData: (data) => ({
//                 data: data.users,
//                 totalCount: data.users.length,
//             }),
//         });
//
//         if (!tableData) return <></>;
//
//         return (
//             <DirtyHandler>
//                 <Selection>
//                     <TableQuery api={api} loading={loading} error={error}>
//                         <Grid container spacing={4}>
//                             <Grid item xs={2}>
//                                 <ExampleTable tableData={tableData} selectedId={selection.id} selectionApi={selectionApi} />
//                             </Grid>
//                             <Grid item xs={2}>
//                                 <Selected selectionMode={selection.mode} selectedId={selection.id} rows={tableData.data}>
//                                     {(user, { selectionMode: selectedSelectionMode }) => <ExampleForm mode={selectedSelectionMode} user={user} />}
//                                 </Selected>
//                             </Grid>
//                         </Grid>
//                     </TableQuery>
//                 </Selection>
//             </DirtyHandler>
//         );
//     });
