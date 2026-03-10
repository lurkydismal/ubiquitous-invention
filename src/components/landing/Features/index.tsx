import { Container } from "@mui/material";
import Title from "./Title";
import FeaturesClient from "./FeaturesClient";

export default function Features() {
    return (
        <Container sx={{ py: { xs: 8, sm: 16 } }}>
            <Title />

            <FeaturesClient initialIndex={0} />
        </Container>
    );
}
