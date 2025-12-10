// useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTasks = () => {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery(["tasks"], () =>
        fetch("/api/tasks").then(res => res.json())
    );

    const addTask = useMutation(
        (newTask: Task) => fetch("/api/tasks", { method: "POST", body: JSON.stringify(newTask) }),
        { onSuccess: () => queryClient.invalidateQueries(["tasks"]) }
    );

    return { tasksQuery, addTask };
};
