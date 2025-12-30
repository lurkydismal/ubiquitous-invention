"use client";

import * as React from "react";
import {
    DataGrid,
    GridFilterModel,
    GridRowsProp,
    GridColDef,
} from "@mui/x-data-grid";

export default function TasksGrid({
    columns,
    rows,
    statusSearchFilter,
}: {
    columns: GridColDef[];
    rows: GridRowsProp;
    statusSearchFilter?: string;
}) {
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() =>
        statusSearchFilter
            ? {
                items: [
                    {
                        field: "status",
                        operator: "equals",
                        value: statusSearchFilter,
                    },
                ],
            }
            : { items: [] },
    );

    React.useEffect(() => {
        if (statusSearchFilter) {
            setFilterModel({
                items: [
                    {
                        field: "status",
                        operator: "equals",
                        value: statusSearchFilter,
                    },
                ],
            });
        } else {
            setFilterModel({ items: [] });
        }
    }, [statusSearchFilter]);

    return (
        <DataGrid
            disableColumnResize
            disableRowSelectionOnClick
            autoPageSize
            showToolbar
            density="compact"
            rows={rows}
            columns={columns}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            sx={{
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                },
            }}
            onRowClick={(params, _) => {
                console.log("Row clicked", params);
            }}
        /*
        initialState={
            statusSearchFilter ? {
                filter: {
                    filterModel: {
                        items: [{ field: 'status', operator: 'equals', value: statusSearchFilter }],
                    },
                },
            } : {}}
        */
        />
    );
}
