"use client";

import * as React from "react";
import log from "@/utils/stdlog";
import {
    DataGrid,
    DataGridProps,
    GridFilterModel,
    GridRowParams,
    GridRowsProp,
} from "@mui/x-data-grid";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
} from "@mui/material";
import columns from "./columns";

type TasksGridProps = Omit<DataGridProps, 'columns'> & {
    rows: GridRowsProp;
    statusSearchFilter?: string;
};

export default function TasksGrid({
    rows,
    statusSearchFilter,
    ...props
}: TasksGridProps) {
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

    const [selectedRow, setSelectedRow] = React.useState<Record<
        string,
        any
    > | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleRowClick = (params: GridRowParams) => {
        log.info("Row clicked", params);
        // store the whole row object
        setSelectedRow(params.row as Record<string, any>);
        setDialogOpen(true);
    };

    const handleClose = () => setDialogOpen(false);

    const renderValue = (value: any) => {
        if (value === null || value === undefined)
            return <Typography color="text.secondary">—</Typography>;
        if (typeof value === "object") {
            try {
                return (
                    <Typography
                        component="pre"
                        variant="body2"
                        sx={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                            m: 0,
                        }}
                    >
                        {JSON.stringify(value, null, 2)}
                    </Typography>
                );
            } catch {
                return (
                    <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                    >
                        {String(value)}
                    </Typography>
                );
            }
        }
        return (
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {String(value)}
            </Typography>
        );
    };

    return (
        <>
            <DataGrid
                {...props}
                disableColumnResize
                disableRowSelectionOnClick
                autoPageSize
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
                onRowClick={handleRowClick}
            />

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                keepMounted
                slotProps={{
                    transition: {
                        onExited: () => {
                            // only clear the heavy/volatile data after exit animation completes
                            setSelectedRow(null);
                        },
                    },
                }}
            >
                <DialogTitle>Row details</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={1}>
                                {Object.entries(selectedRow).map(
                                    ([key, value]) => (
                                        <React.Fragment key={key}>
                                            <Grid size={{ xs: 4, sm: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                >
                                                    {key}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8, sm: 9 }}>
                                                {renderValue(value)}
                                            </Grid>
                                        </React.Fragment>
                                    ),
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="outlined"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
