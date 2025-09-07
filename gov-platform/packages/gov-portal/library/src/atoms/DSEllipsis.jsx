function DSEllipsis({ children, lines = 2 }) {
    return (
        <span
            style={{
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
            }}
        >
            {children}
        </span>
    );
}
export default DSEllipsis;