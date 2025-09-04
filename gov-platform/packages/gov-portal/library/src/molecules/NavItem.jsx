import React from "react";
import PropTypes from "prop-types";
import { ListItemButton, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconSlot from "../atoms/IconSlot";
import NavChevron from "../atoms/NavChevron";
import TypographyX from "../atoms/TypographyX";

export default function NavItem({ item, level = 0, selected, open, onClick }) {
  const theme = useTheme();

  const INDENT = 12 + level * 14;
  const ICON_W  = 24;

  // light-on-dark palette
  const txt      = "#EAF0F7";
  const txtDim   = "rgba(234,240,247,0.72)";
  const hoverBg  = "rgba(255,255,255,0.06)";
  const activeBg = "rgba(120,180,255,0.14)";
  const activeBd = "rgba(120,180,255,0.28)";
  const accent   = "rgba(120,180,255,1)";

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <ListItemButton
      onClick={onClick}
      selected={!!selected}
      sx={{
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        my: 0.5,
        py: 0.9,
        pr: 1.25,
        pl: 0,
        borderRadius: 1.75,
        position: "relative",
        color: selected ? txt : txt, // keep bright
        backgroundColor: selected ? activeBg : "transparent",
        border: selected ? `1px solid ${activeBd}` : "1px solid transparent",
        transition: "background-color .18s ease, transform .12s ease, border-color .18s ease",
        "&:hover": { backgroundColor: hoverBg, transform: "translateY(-1px)" },
        "&::before": selected
          ? {
              content: '""',
              position: "absolute",
              left: 6,
              top: 8,
              bottom: 8,
              width: 3,
              borderRadius: 3,
              background: `linear-gradient(${accent}, rgba(120,180,255,0.25))`,
            }
          : {},
      }}
    >
      {/* left indent */}
      <Box sx={{ width: INDENT, flex: "0 0 auto" }} />

      {/* icon col */}
      <Box
        sx={{
          width: ICON_W,
          height: 22,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: selected ? accent : txtDim,
        }}
      >
        {item.icon ? <IconSlot name={item.icon} /> : null}
      </Box>

      {/* label */}
      <TypographyX
        variant="body2"
        sx={{
          flex: "1 1 auto",
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: selected ? 700 : 600,
          letterSpacing: 0.1,
          color: selected ? "#DCE9FF" : txt, // a hint brighter on active
        }}
        onClick={(e) => { if (!hasChildren && onClick) onClick(e); }}
      >
        {item.label}
      </TypographyX>

      {/* chevron / spacer */}
      {hasChildren ? (
        <Box sx={{ color: selected ? accent : txtDim }}>
          <NavChevron open={open} />
        </Box>
      ) : (
        <Box sx={{ width: 12, flex: "0 0 auto" }} />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  selected: PropTypes.bool,
  open: PropTypes.bool,
  onClick: PropTypes.func,
};
