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
            rows={rows}
            columns={columns}
            sx={{
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                },
            }}
            onRowClick={(params, _) => {
                console.log("Row clicked", params);
            }}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
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
            disableColumnResize
            disableRowSelectionOnClick
            autoPageSize
            density="compact"
        />
    );
}
