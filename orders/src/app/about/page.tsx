import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '@/components/ProTip';
import Copyright from '@/components/Copyright';
import { ButtonLink } from '@/components/Link';

export default function About() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Material UI - Next.js example in TypeScript
                </Typography>
                <Box sx={{ maxWidth: 'sm' }}>
                    <ButtonLink variant="contained" href="/">
                        Go to the home page
                    </ButtonLink>
                </Box>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}
