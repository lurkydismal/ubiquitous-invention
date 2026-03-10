import { RssFeedRounded, SearchRounded } from "@mui/icons-material";
import {
    FormControl,
    OutlinedInput,
    InputAdornment,
    Box,
    IconButton,
} from "@mui/material";

function Search() {
    return (
        <FormControl
            sx={{ width: { xs: "100%", md: "25ch" } }}
            variant="outlined"
        >
            <OutlinedInput
                placeholder="Search…"
                size="small"
                sx={{ flexGrow: 1 }}
                inputProps={{
                    "aria-label": "search",
                }}
                startAdornment={
                    <InputAdornment
                        position="start"
                        sx={{ color: "text.primary" }}
                    >
                        <SearchRounded fontSize="small" />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}

export function SearchButton() {
    return (
        <Box
            sx={{
                display: { xs: "flex", sm: "none" },
                flexDirection: "row",
                gap: 1,
                overflow: "auto",
                width: { xs: "100%", md: "fit-content" },
            }}
        >
            <Search />

            <IconButton size="small" aria-label="RSS feed">
                <RssFeedRounded />
            </IconButton>
        </Box>
    );
}

export function SearchButtonMobile() {
    return (
        <Box
            sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "row",
                gap: 1,
                overflow: "auto",
                width: { xs: "100%", md: "fit-content" },
            }}
        >
            <Search />

            <IconButton size="small" aria-label="RSS feed">
                <RssFeedRounded />
            </IconButton>
        </Box>
    );
}
