export const DRAWER_WIDTH = 256;


export function ensureId(item, idx, parentKey = "root") {
    return item.id || `${parentKey}-${item.path || item.url || item.label || "item"}-${idx}`;
}


export function findAncestorsByPath(items, currentPath, pathKey = "path", acc = [], trail = []) {
    for (let i = 0; i < items.length; i += 1) {
        const it = items[i];
        const id = ensureId(it, i, trail.join("/"));
        const nextTrail = [...trail, id];
        const match = it[pathKey] && currentPath && currentPath.startsWith(it[pathKey]);
        if (it.children && it.children.length) {
            const kid = findAncestorsByPath(it.children, currentPath, pathKey, acc, nextTrail);
            if (kid.length || match) acc.push(id);
        } else if (match) {
            acc.push(...trail);
        }
    }
    return Array.from(new Set(acc));
}


export function filterTreeByQuery(menu, query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return menu;
    const filter = (nodes) =>
        nodes
            .map((n, idx) => {
                const label = (n.label || "").toLowerCase();
                const keepSelf = label.includes(q);
                const kids = n.children ? filter(n.children) : [];
                if (keepSelf || kids.length) return { ...n, children: kids };
                return null;
            })
            .filter(Boolean);
    return filter(menu);
}


export function filterTreeByRole(menu, user, hasRole) {
    if (!hasRole) return menu;
    const filter = (nodes) =>
        nodes
            .map((n) => {
                const allowed = !n.roles || n.roles.some((r) => hasRole(user, r));
                const kids = n.children ? filter(n.children) : [];
                if (allowed || kids.length) return { ...n, children: kids };
                return null;
            })
            .filter(Boolean);
    return filter(menu);
}