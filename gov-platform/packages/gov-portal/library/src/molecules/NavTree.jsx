import React from "react";
import PropTypes from "prop-types";
import { List, Collapse, Divider } from "@mui/material";
import { ensureId } from "../utils/menu-utils";
import NavItem from "./NavItem";


export default function NavTree({ items, currentPath, expandedSet, onToggle, onNavigate, level = 0, parentKey = "root" }) {
    return (
        <List disablePadding>
            {items.map((item, idx) => {
                const id = ensureId(item, idx, parentKey);
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const selected = item.path && currentPath.startsWith(item.path);
                return (
                    <React.Fragment key={id}>
                        <NavItem
                            item={item}
                            level={level}
                            selected={selected}
                            open={expandedSet.has(id)}
                            onClick={() => (hasChildren ? onToggle(id) : onNavigate(item))}
                        />
                        {hasChildren && (
                            <Collapse in={expandedSet.has(id)} timeout="auto" unmountOnExit>
                                <NavTree
                                    items={item.children}
                                    currentPath={currentPath}
                                    expandedSet={expandedSet}
                                    onToggle={onToggle}
                                    onNavigate={onNavigate}
                                    level={level + 1}
                                    parentKey={id}
                                />
                            </Collapse>
                        )}
                        {item.divider ? <Divider sx={{ my: 0.5 }} /> : null}
                    </React.Fragment>
                );
            })}
        </List>
    );
}
NavTree.propTypes = {
    items: PropTypes.array.isRequired,
    currentPath: PropTypes.string.isRequired,
    expandedSet: PropTypes.object.isRequired, // Set
    onToggle: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    level: PropTypes.number,
    parentKey: PropTypes.string,
};