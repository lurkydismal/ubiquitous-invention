"use client";

import { DataGrid } from "@mui/x-data-grid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";

export default function CustomizedDataGrid({ columns, rows, statusSearchFilter, isClickable }: { columns: GridColDef[], rows: GridRowsProp, statusSearchFilter?: string, isClickable?: boolean }) {
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            {...(isClickable
                ? {
                    sx: {
                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                        },
                    },
                    onRowClick: (params, _) => {
                        console.log('Row clicked', params);
                    }
                } : {})}
            initialState={
                statusSearchFilter ? {
                    filter: {
                        filterModel: {
                            items: [{ field: 'status', operator: 'equals', value: statusSearchFilter }],
                        },
                    },
                } : {}}
            disableColumnResize
            disableRowSelectionOnClick
            autoPageSize
            density="compact"
            slotProps={{
                filterPanel: {
                    filterFormProps: {
                        logicOperatorInputProps: {
                            variant: "outlined",
                            size: "small",
                        },
                        columnInputProps: {
                            variant: "outlined",
                            size: "small",
                            sx: { mt: "auto" },
                        },
                        operatorInputProps: {
                            variant: "outlined",
                            size: "small",
                            sx: { mt: "auto" },
                        },
                        valueInputProps: {
                            InputComponentProps: {
                                variant: "outlined",
                                size: "small",
                            },
                        },
                    },
                },
            }}
        />
    );
}
