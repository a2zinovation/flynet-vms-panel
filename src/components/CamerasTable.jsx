// src/components/CamerasTable.jsx
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TablePagination, TableSortLabel, Tooltip, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";

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

export default function CamerasTable({ rows = [], onDelete = () => {} }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sorted = rows.slice().sort(getComparator(order, orderBy));
  const displayed = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, p: 1 }}>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {["Name", "Type", "Analytical", "Host", "Storage", "Resolution", "Status", "Actions"].map((h, idx) => {
                const key = h.toLowerCase().replace(/\s+/g, "");
                if (h === "Actions") {
                  return <TableCell key={h} align="center">{h}</TableCell>;
                }
                return (
                  <TableCell key={h}>
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : "asc"}
                      onClick={() => handleRequestSort(key)}
                    >
                      {h}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayed.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.analytical}</TableCell>
                <TableCell>{row.host}</TableCell>
                <TableCell>{row.storage}</TableCell>
                <TableCell>{row.resolution}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Settings"><IconButton size="small"><SettingsIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => onDelete(row.id)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>No results found!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 8, 10, 25]}
        />
      </Box>
    </Paper>
  );
}
