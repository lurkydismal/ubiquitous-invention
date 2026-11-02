type Position = "left" | "right";

export interface NavItem {
    name: string;
    href: string;
    position: Position;
    badge?: boolean;
}

export const items: NavItem[] = [
    {
        name: "This Current Table",
        href: "/dashboard",
        position: "left",
    },
    {
        name: "The Very Same Table",
        href: "/messages",
        position: "right",
    },
    {
        name: "The Very Same Table",
        href: "/tasks",
        position: "right",
    },
];
