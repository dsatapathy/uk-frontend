import React from "react";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";
import ResponsiveNav from "../organisms/ResponsiveNav";


export default function NavLayout({ menu, logo, title = "UGVS-REAP : MIS", user, onSearch, onNavigate, children }) {
    const history = useHistory();
    const location = useLocation();
    const currentPath = location?.pathname || "/";


    const navigate = React.useCallback(
        (item) => {
            const isExternal = item.url && !item.path;
            const target = item.path || item.url;
            if (!target) return;
            if (onNavigate) onNavigate(target, item);
            else if (isExternal) window.open(target, item.target || "_blank");
            else history.push(target);
        },
        [history, onNavigate]
    );


    return (
        <ResponsiveNav
            menu={menu}
            logo={logo}
            title={title}
            user={user}
            onSearch={onSearch}
            onNavigate={navigate}
            currentPath={currentPath}
        >
            {children}
        </ResponsiveNav>
    );
}
NavLayout.propTypes = {
    menu: PropTypes.array.isRequired,
    logo: PropTypes.node,
    title: PropTypes.string,
    user: PropTypes.object,
    onSearch: PropTypes.func,
    onNavigate: PropTypes.func,
    children: PropTypes.node,
};