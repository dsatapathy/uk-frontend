import React from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";


export default function NavChevron({ open }) {
    return open ? <ExpandLess /> : <ExpandMore />;
}