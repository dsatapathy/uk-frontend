import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import NavItem from "./NavItem";
import { ensureId } from "../utils/menu-utils";

// ---- flatten visible nodes according to expandedSet ----
function flatten(items, expandedSet, parentKey = "root", level = 0, out = []) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = ensureId(item, i, parentKey);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const open = expandedSet.has(id);
    out.push({ id, item, level, hasChildren, open, parentKey });

    if (hasChildren && open) {
      flatten(item.children, expandedSet, id, level + 1, out);
    }
  }
  return out;
}

// ---- tiny rAF-based scroll state ----
function useRafScroll(containerRef) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const frame = React.useRef(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (frame.current) return; // coalesce to next animation frame
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        setScrollTop(el.scrollTop);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    setScrollTop(el.scrollTop); // initial
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [containerRef]);

  return scrollTop;
}

const Row = React.memo(function Row({ node, selected, onClick, style }) {
  return (
    <div style={style}>
      <NavItem
        item={node.item}
        level={node.level}
        selected={selected}
        open={node.open}
        onClick={onClick}
      />
    </div>
  );
}, (a, b) => (
  a.node.id === b.node.id &&
  a.node.open === b.node.open &&
  a.selected === b.selected &&
  a.style.transform === b.style.transform // stable start position
));

export default function VirtualNavTree({
  items,
  currentPath,
  expandedSet,
  onToggle,
  onNavigate,
  rowHeight = 44,
  overscan = 6,
}) {
  const rows = React.useMemo(() => flatten(items, expandedSet), [items, expandedSet]);
  const total = rows.length;
  const containerRef = React.useRef(null);
  const scrollTop = useRafScroll(containerRef);
  const [viewportHeight, setViewportHeight] = React.useState(0);

  // track container height (once, and on resize)
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setViewportHeight(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // compute visible window
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(total, startIndex + visibleCount);
  const offsetY = startIndex * rowHeight;

  return (
    <Box
      ref={containerRef}
      sx={{ height: "100%", overflowY: "auto", position: "relative" }}
      role="tree"
    >
      {/* spacer to create total scroll range */}
      <Box sx={{ height: total * rowHeight, position: "relative" }}>
        {/* slice into view */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, transform: `translateY(${offsetY}px)` }}>
          {rows.slice(startIndex, endIndex).map((node, i) => {
            const idx = startIndex + i;
            const selected = !!(node.item.path && currentPath.startsWith(node.item.path));
            const style = { height: rowHeight, overflow: "hidden" };
            const handleClick = () => {
              if (node.hasChildren) onToggle(node.id);
              else onNavigate(node.item);
            };
            return (
              <Row
                key={node.id}
                node={node}
                selected={selected}
                onClick={handleClick}
                style={style}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

VirtualNavTree.propTypes = {
  items: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
  expandedSet: PropTypes.object.isRequired, // Set
  onToggle: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  rowHeight: PropTypes.number,
  overscan: PropTypes.number,
};
