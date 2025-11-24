import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { visuallyHidden } from "@mui/utils";

/* -------------------- Sorting Utilities -------------------- */
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

/* -------------------- Table Head -------------------- */
function EnhancedTableHead({ columns, order, orderBy, onRequestSort, hasActions }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);
  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        {hasActions && <TableCell align="center">Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}

/* -------------------- Toolbar -------------------- */
const EnhancedTableToolbar = ({ title, searchValue, onSearchChange }) => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography variant="h6" id="tableTitle" component="div">
      {title}
    </Typography>
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: "300px" }}
    />
  </Toolbar>
);

/* -------------------- Main Component -------------------- */
export default function DynamicTable({
  title,
  columns,
  data,
  actions = [],
  loading = false,

  // Pagination Props (fully controlled by parent)
  page = 1,
  pageSize = 10,
  total = 0,
  onNextPage,
  onPrevPage,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns.length > 0 ? columns[0].id : "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Local filtering/sorting (optional for client-side preview)
  const filteredAndSortedData = useMemo(() => {
    const filteredData = data.filter((row) =>
      columns.some((column) =>
        String(row[column.id] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
    return stableSort(filteredData, getComparator(order, orderBy));
  }, [data, order, orderBy, searchTerm, columns]);

  // const totalPages = Math.ceil(total / pageSize) || 1;
  const isFirstPage = page <= 1;
  const isLastPage = page >= total;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          title={title}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              columns={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              hasActions={actions.length > 0}
            />
            <TableBody>
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((row, index) => (
                  <TableRow hover key={row.id || index}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.numeric ? "right" : "left"}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="center">
                        {actions.map((action) => (
                          <Tooltip title={action.label} key={action.label}>
                            <IconButton onClick={() => action.onClick(row)}>
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length ? 1 : 0)} align="center">
                    {loading ? "Loading..." : "No records found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* --- Custom Pagination Footer --- */}
        {total > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderTop: "1px solid #eee",
            }}
          >
            <Typography variant="body2">
              Showing Page {page} of {total}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={onPrevPage}
                disabled={isFirstPage || loading}
              >
                Prev
              </Button>

              <Typography variant="body2">
                Page {page} of {total}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={onNextPage}
                disabled={isLastPage || loading}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

/* -------------------- PropTypes -------------------- */
DynamicTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      sortable: PropTypes.bool,
      disablePadding: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  loading: PropTypes.bool,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onNextPage: PropTypes.func,
  onPrevPage: PropTypes.func,
};
