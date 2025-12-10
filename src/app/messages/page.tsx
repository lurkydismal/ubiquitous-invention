import Box from "@mui/joy/Box";
import MyMessages from "@/components/MyMessages";

export default function Home() {
    return (
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyMessages />
        </Box>
    );
}
