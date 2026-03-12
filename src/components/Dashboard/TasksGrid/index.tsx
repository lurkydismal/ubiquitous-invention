"use client";

import { DataGrid, DataGridProps, GridRowsProp } from "@mui/x-data-grid";
import columns from "./columns";

type TasksGridProps = Omit<DataGridProps, "columns"> & {
    rows: GridRowsProp;
    statusSearchFilter?: string;
};

export default function TasksGrid({
    rows,
    statusSearchFilter,
    ...props
}: TasksGridProps) {
    return (
        <DataGrid
            {...props}
            disableColumnResize
            disableRowSelectionOnClick
            autoPageSize
            density="compact"
            rows={rows}
            columns={columns}
            initialState={{
                filter: {
                    filterModel: statusSearchFilter
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
                },
            }}
        />
    );
}
