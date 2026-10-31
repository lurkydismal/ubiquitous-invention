import { Box } from "@mui/material";

import MyMessages from "@/components/Messages";

export default function Page() {
    return (
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyMessages />
        </Box>
    );
}
