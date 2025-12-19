"use client";

import * as React from "react";
import { DataGrid, GridFilterModel } from "@mui/x-data-grid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";

export default function CustomizedDataGrid({
    columns,
    rows,
    statusSearchFilter,
    isClickable,
}: {
    columns: GridColDef[];
    rows: GridRowsProp;
    statusSearchFilter?: string;
    isClickable?: boolean;
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
            {...(isClickable
                ? {
                      sx: {
                          "& .MuiDataGrid-row": {
                              cursor: "pointer",
                          },
                      },
                      onRowClick: (params, _) => {
                          console.log("Row clicked", params);
                      },
                  }
                : {})}
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
