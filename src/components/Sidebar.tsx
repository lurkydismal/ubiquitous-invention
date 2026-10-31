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
import { unauthorized, usePathname } from "next/navigation";

import NextLink from "@/components/Link";
import { getSession } from "@/lib/dal/auth";

import Toggler from "./Toggler";

const taskLinks = [
    { label: "All tasks", icon: AllIcon, href: "/tasks" },
    {
        label: "In progress",
        icon: InProgressIcon,
        href: "/tasks?filter=in-progress",
    },
    {
        label: "Finished",
        icon: FinishedIcon,
        href: "/tasks?filter=finished",
    },
    {
        label: "Cancelled",
        icon: CancelledIcon,
        href: "/tasks?filter=cancelled",
    },
    {
        label: "Outdated",
        icon: OutdatedIcon,
        href: "/tasks?filter=outdated",
    },
];

const menu = [
    {
        key: "dashboard",
        type: "link" as const,
        href: "/dashboard",
        label: "Dashboard",
        Icon: DashboardRoundedIcon,
        isSelected: (p: string) => p.includes("/dashboard"),
    },
    {
        key: "tasks",
        type: "nested" as const,
        label: "Tasks",
        Icon: AssignmentRoundedIcon,
        isSelected: (p: string) => p.includes("/tasks"),
        children: taskLinks,
    },
    {
        key: "messages",
        type: "link" as const,
        href: "/messages",
        label: "Messages",
        Icon: QuestionAnswerRoundedIcon,
        badge: 4,
        isSelected: (p: string) => p.includes("/messages"),
    },
];

export default async function Sidebar() {
    const pathnameRaw = usePathname() ?? "/";
    const pathname = pathnameRaw.replace(/\/+$/, "") || "/";

    const session = await getSession();
    if (!session) return unauthorized();
    const username = session.user.name;

    return (
        <Paper
            component="aside"
            square
            elevation={0}
            className="Sidebar"
            sx={{
                position: { xs: "fixed", md: "sticky" },
                transform: {
                    xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                    md: "none",
                },
                transition: "transform 0.4s, width 0.4s",
                zIndex: 10000,
                height: "100dvh",
                width: "var(--Sidebar-width)",
                top: 0,
                p: 2,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRight: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
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

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <IconButton
                    component={NextLink}
                    href="/"
                    color="primary"
                    size="small"
                    sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
                >
                    <PendingActionsRoundedIcon />
                </IconButton>

                <Typography variant="h6" component={NextLink} href="/" color="inherit" noWrap>
                    Tasker
                </Typography>
            </Box>

            <Divider />

            <Box
                sx={{
                    minHeight: 0,
                    overflow: "hidden auto",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                        borderRadius: 1.5,
                    },
                }}
            >
                <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {menu.map((item) => {
                        const Icon = item.Icon;

                        if (item.type === "link") {
                            return (
                                <ListItem key={item.key} disablePadding>
                                    <ListItemButton
                                        component={NextLink}
                                        href={item.href}
                                        selected={item.isSelected(pathname)}
                                        sx={{ px: 1.5, py: 1 }}
                                    >
                                        <Icon fontSize="small" />

                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                variant: "body2",
                                                fontWeight: 600,
                                            }}
                                        />

                                        {item.badge ? (
                                            <Chip
                                                size="small"
                                                color="primary"
                                                variant="filled"
                                                label={item.badge}
                                            />
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>
                            );
                        }

                        const isSelected = item.isSelected(pathname);

                        return (
                            <ListItem key={item.key} disablePadding sx={{ display: "block" }}>
                                <Toggler
                                    defaultExpanded={isSelected}
                                    renderToggle={({ open, setOpen }) => (
                                        <ListItemButton
                                            onClick={() => setOpen(!open)}
                                            selected={isSelected}
                                            sx={{ px: 1.5, py: 1 }}
                                        >
                                            <Icon fontSize="small" />

                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: 600,
                                                }}
                                            />

                                            <KeyboardArrowDownIcon
                                                sx={{
                                                    transform: open ? "rotate(180deg)" : "none",
                                                    transition: "transform 0.2s ease",
                                                }}
                                            />
                                        </ListItemButton>
                                    )}
                                >
                                    <List disablePadding sx={{ pl: 3, pt: 0.5, gap: 0.5 }}>
                                        {item.children.map((child) => {
                                            const ChildIcon = child.icon;

                                            return (
                                                <ListItem key={child.href} disablePadding>
                                                    <ListItemButton
                                                        component={NextLink}
                                                        href={child.href}
                                                        selected={
                                                            pathname === child.href.split("?")[0] &&
                                                            (!child.href.includes("?") ||
                                                                pathnameRaw.includes(
                                                                    child.href.split("?")[1],
                                                                ))
                                                        }
                                                        sx={{ px: 1.5, py: 0.75 }}
                                                    >
                                                        <ChildIcon fontSize="small" />
                                                        <ListItemText
                                                            primary={child.label}
                                                            primaryTypographyProps={{
                                                                variant: "body2",
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Toggler>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar variant="outlined" size="small" alt={username}>
                    {username.slice(0, 1).toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                        {username}
                    </Typography>
                </Box>

                <IconButton size="small" aria-label="Log out" color="inherit">
                    <LogoutRoundedIcon />
                </IconButton>
            </Box>
        </Paper>
    );
}
