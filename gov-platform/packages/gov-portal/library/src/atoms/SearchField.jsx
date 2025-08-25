import React from "react";
import { Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


export default function SearchField({ value, onChange, onEnter }) {
return (
<Paper sx={{ flex: 1, display: "flex", alignItems: "center", px: 1, py: 0.25 }} variant="outlined">
<SearchIcon sx={{ mr: 1 }} />
<InputBase
fullWidth
placeholder="Search…"
inputProps={{ "aria-label": "search" }}
value={value}
onChange={(e) => onChange?.(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") onEnter?.(value);
}}
/>
</Paper>
);
}