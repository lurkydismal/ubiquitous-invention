import MainContent from "@/components/new-post/MainContent";
import { Container } from "@mui/material";

export default function NewPost() {
    return (
        <Container
            maxWidth="xl"
            sx={{
                pt: "1%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <MainContent />
        </Container>
    );
}
