import { Box } from "@mui/joy";

import MyMessages from "@/components/Messages";

export default function Page() {
    return (
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyMessages />
        </Box>
    );
}
