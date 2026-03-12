export type UserProps = {
    name: string;
    online: boolean;
};

export type MessageProps = {
    id: string;
    content: string;
    timestamp: string;
    unread?: boolean;
    sender: UserProps | "You";
};

export type ChatProps = {
    id: string;
    sender: UserProps;
    messages: MessageProps[];
};
