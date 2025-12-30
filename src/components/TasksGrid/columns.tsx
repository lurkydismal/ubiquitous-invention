import { Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
    CheckRounded as FinishedIcon,
    AutorenewRounded as InProgressIcon,
    Block as CancelledIcon,
    HistoryRounded as OutdatedIcon,
} from "@mui/icons-material";
import AvatarChip from "@/components/AvatarChip";
import dayjs from '@/utils/dayjs';

function fieldFromHeader(headerName: string): string {
    return (
        headerName
            .trim()
            .toLowerCase()
            // Remove special chars (keep spaces)
            .replace(/[^a-z0-9 ]+/g, "")
            .replace(/\s+([a-z0-9])/g, (_, c) => c.toUpperCase())
    );
}

type Status = "Finished" | "In Progress" | "Cancelled" | "Outdated";
type StatusColor =
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";

function renderStatus(status: Status) {
    const config: Record<
        Status,
        { color: StatusColor; icon: React.ReactElement }
    > = {
        Finished: {
            color: "success",
            icon: <FinishedIcon />,
        },
        "In Progress": {
            color: "default",
            icon: <InProgressIcon />,
        },
        Cancelled: {
            color: "warning",
            icon: <CancelledIcon />,
        },
        Outdated: {
            color: "error",
            icon: <OutdatedIcon />,
        },
    };

    const { color, icon } = config[status];

    return (
        <Chip
            variant="outlined"
            size="small"
            icon={icon}
            color={color}
            label={status}
        ></Chip>
    );
}

function renderUser(username: string) {
    return <AvatarChip username={username}></AvatarChip>;
}

function renderDate(_date: string) {
    const date = dayjs(_date);
    return date.isAfter(dayjs().subtract(1, 'hour'))
        ? `🟢 ${date.format()}`
        : date.format();
}

const columns = [
    {
        field: "title",
        headerName: "Title",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
    },
    {
        headerName: "Status",
        renderCell: (params: GridRenderCellParams) =>
            renderStatus(params.value as any),
    },
    {
        headerName: "Tag",
    },
    {
        headerName: "Author",
        renderCell: (params: GridRenderCellParams) =>
            renderUser(params.value as any),
    },
    {
        headerName: "Tracker",
        renderCell: (params: GridRenderCellParams) =>
            renderUser(params.value as any),
    },
    {
        headerName: "Created At",
        valueGetter: (params: GridRenderCellParams) => new Date(params.value),
        valueFormatter: (params: GridRenderCellParams) =>
            renderDate(params.value),
    },
    {
        headerName: "Updated At",
        valueGetter: (params: GridRenderCellParams) => new Date(params.value),
        valueFormatter: (params: GridRenderCellParams) =>
            renderDate(params.value),
    },
    {
        headerName: "End Date",
        valueGetter: (params: GridRenderCellParams) => new Date(params.value),
        valueFormatter: (params: GridRenderCellParams) =>
            renderDate(params.value),
    },
].map((item) => {
    return {
        ...item,
        headerAlign: "center",
        align: "center",
        ...(item.flex == null ? { flex: 1 } : {}),
        ...(item.minWidth == null ? { minWidth: 100 } : {}),
        ...(item.field == null
            ? { field: fieldFromHeader(item.headerName) }
            : {}),
    };
}) as readonly GridColDef[];

export default columns;
