import MyMessages from "@/components/MyMessages";
import { Box } from "@mui/joy";

export default function Page() {
    return (
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyMessages />
        </Box>
    );
}
