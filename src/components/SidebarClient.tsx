"use client";

import {
    DashboardRounded as DashboardRoundedIcon,
    AssignmentRounded as AssignmentRoundedIcon,
    QuestionAnswerRounded as QuestionAnswerRoundedIcon,
    LogoutRounded as LogoutRoundedIcon,
    PendingActionsRounded as PendingActionsRoundedIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    FormatListBulleted as AllIcon,
    PendingOutlined as InProgressIcon,
    CheckCircleOutlined as FinishedIcon,
    CancelOutlined as CancelledIcon,
    ScheduleOutlined as OutdatedIcon,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Chip,
    Collapse,
    Divider,
    GlobalStyles,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
    listItemButtonClasses,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import NextLink from "@/components/Link";
import { logout } from "@/lib/safe/auth";
import { useSnackbar } from "@/providers/snackbar";

const taskLinks = [
    { label: "All tasks", filter: null, Icon: AllIcon },
    { label: "In progress", filter: "in-progress", Icon: InProgressIcon },
    { label: "Finished", filter: "finished", Icon: FinishedIcon },
    { label: "Cancelled", filter: "cancelled", Icon: CancelledIcon },
    { label: "Outdated", filter: "outdated", Icon: OutdatedIcon },
] as const;

const mainLinks = [
    {
        key: "dashboard",
        href: "/dashboard",
        label: "Dashboard",
        Icon: DashboardRoundedIcon,
        badge: undefined,
    },
    {
        key: "messages",
        href: "/messages",
        label: "Messages",
        Icon: QuestionAnswerRoundedIcon,
        badge: 4,
    },
] as const;

function normalizePathname(pathname: string) {
    if (pathname === "/") return pathname;
    return pathname.replace(/\/+$/, "");
}

function isActivePath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarClientProps = {
    username: string;
};

export default function SidebarClient({ username }: SidebarClientProps) {
    const pathname = normalizePathname(usePathname() ?? "/");
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showError } = useSnackbar();

    const isTasksPage = isActivePath(pathname, "/tasks");
    const activeTaskFilter = searchParams.get("filter");

    const [tasksOpen, setTasksOpen] = useState(isTasksPage);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Expand the task section when navigation enters /tasks.
    useEffect(() => {
        if (isTasksPage) {
            setTasksOpen(true);
        }
    }, [isTasksPage]);

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            await logout();

            router.replace("/auth/login");
            router.refresh();
        } catch (error) {
            showError(error);
        } finally {
            setIsLoggingOut(false);
        }
    }

    const avatarText = username.trim().charAt(0).toUpperCase() || "U";

    return (
        <>
            <GlobalStyles
                styles={(theme) => ({
                    ":root": {
                        "--Sidebar-width": "220px",
                        [theme.breakpoints.up("lg")]: {
                            "--Sidebar-width": "240px",
                        },
                    },
                })}
            />

            <Paper
                component="aside"
                square
                elevation={0}
                className="Sidebar"
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    height: { xs: "auto", md: "100dvh" },
                    maxHeight: { xs: "48dvh", md: "none" },
                    width: { xs: "100%", md: "var(--Sidebar-width)" },
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                }}
            >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
                    <IconButton
                        component={NextLink}
                        href="/"
                        color="primary"
                        size="small"
                        aria-label="Go to home"
                        sx={{
                            flexShrink: 0,
                            bgcolor: "action.hover",
                            "&:hover": { bgcolor: "action.selected" },
                        }}
                    >
                        <PendingActionsRoundedIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component={NextLink}
                        href="/"
                        color="inherit"
                        noWrap
                        sx={{ textDecoration: "none" }}
                    >
                        Tasker
                    </Typography>
                </Box>

                <Divider />

                <Box
                    sx={{
                        minHeight: 0,
                        flexGrow: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        [`& .${listItemButtonClasses.root}`]: {
                            gap: 1.5,
                            borderRadius: 1.5,
                        },
                    }}
                >
                    <List
                        component="nav"
                        aria-label="Main navigation"
                        disablePadding
                        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                        {mainLinks.map(({ key, href, label, Icon, badge }) => {
                            const selected = isActivePath(pathname, href);

                            return (
                                <ListItem key={key} disablePadding>
                                    <ListItemButton
                                        component={NextLink}
                                        href={href}
                                        selected={selected}
                                        aria-current={selected ? "page" : undefined}
                                        sx={{ px: 1.5, py: 1 }}
                                    >
                                        <Icon fontSize="small" />

                                        <ListItemText
                                            primary={label}
                                            slotProps={{
                                                primary: {
                                                    variant: "body2",
                                                    sx: { fontWeight: 600 },
                                                },
                                            }}
                                        />

                                        {badge !== undefined && (
                                            <Chip
                                                size="small"
                                                color="primary"
                                                variant="filled"
                                                label={badge}
                                                aria-label={`${badge} unread messages`}
                                            />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}

                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                onClick={() => setTasksOpen((open) => !open)}
                                selected={isTasksPage}
                                aria-expanded={tasksOpen}
                                aria-controls="task-navigation"
                                sx={{ px: 1.5, py: 1 }}
                            >
                                <AssignmentRoundedIcon fontSize="small" />

                                <ListItemText
                                    primary="Tasks"
                                    slotProps={{
                                        primary: {
                                            variant: "body2",
                                            sx: { fontWeight: 600 },
                                        },
                                    }}
                                />

                                <KeyboardArrowDownIcon
                                    sx={{
                                        transform: tasksOpen ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s ease",
                                    }}
                                />
                            </ListItemButton>

                            <Collapse in={tasksOpen} timeout="auto" unmountOnExit>
                                <List
                                    id="task-navigation"
                                    component="div"
                                    disablePadding
                                    sx={{
                                        pl: 3,
                                        pt: 0.5,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                    }}
                                >
                                    {taskLinks.map(({ label, filter, Icon }) => {
                                        const selected =
                                            isTasksPage &&
                                            (filter === null
                                                ? activeTaskFilter === null
                                                : activeTaskFilter === filter);
                                        const href = filter ? `/tasks?filter=${filter}` : "/tasks";

                                        return (
                                            <ListItem key={filter ?? "all"} disablePadding>
                                                <ListItemButton
                                                    component={NextLink}
                                                    href={href}
                                                    selected={selected}
                                                    aria-current={selected ? "page" : undefined}
                                                    sx={{ px: 1.5, py: 0.75 }}
                                                >
                                                    <Icon fontSize="small" />
                                                    <ListItemText
                                                        primary={label}
                                                        slotProps={{
                                                            primary: { variant: "body2" },
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </ListItem>
                    </List>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
                    <Avatar
                        alt={username}
                        sx={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        {avatarText}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {username}
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        aria-label="Log out"
                        title="Log out"
                        color="inherit"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogoutRoundedIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Paper>
        </>
    );
}
