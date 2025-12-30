import Chip from "@mui/material/Chip";
import { GridColDef } from "@mui/x-data-grid";

function renderStatus(status: "Online" | "Offline") {
    const colors: { [index: string]: "success" | "default" } = {
        Online: "success",
        Offline: "default",
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

const columns: GridColDef[] = [
    {
        field: "title",
        flex: 1.5,
        headerName: "Title",
        headerAlign: "center",
        align: "center",
        minWidth: 200,
    },
    {
        field: "status",
        headerName: "Status",
        headerAlign: "center",
        align: "center",
        flex: 0.5,
        minWidth: 100,
        renderCell: (params) => renderStatus(params.value as any),
    },
    {
        field: "tag",
        headerName: "Tag",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 80,
    },
    {
        field: "author",
        headerName: "Author",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
    },
    {
        field: "tracker",
        headerName: "Tracker",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
    },
    {
        field: "createdAt",
        headerName: "Created At",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 120,
    },
    {
        field: "endDate",
        headerName: "End Date",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
    },
];

export default columns;
