"use client";

import * as React from "react";
import log from "@/utils/stdlog";
import { DataGrid, GridFilterModel, GridRowsProp } from "@mui/x-data-grid";
import columns from "./columns";

export default function TasksGrid({
    rows,
    statusSearchFilter,
}: {
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
                log.info("Row clicked", params);
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
