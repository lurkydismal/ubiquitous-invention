import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@/components/Link';
import ProTip from '@/components/ProTip';
import Copyright from '@/components/Copyright';
import App from '@/joy/App';

// export default function Home() {
//     return (
//         <Container maxWidth="lg">
//             <Box
//                 sx={{
//                     my: 4,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}
//             >
//                 <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
//                     Material UI - Next.js App Router example in TypeScript
//                 </Typography>
//                 <Link href="/about" color="secondary">
//                     Go to the about page
//                 </Link>
//                 <ProTip />
//                 <Copyright />
//             </Box>
//         </Container>
//     );
// }

export default function Home() {
    return (
        <App></App>
    );
}
