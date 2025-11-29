// src/components/EmptyTableCard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmptyTableCard({ title = "0 items", message = "No results found!" }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.paper",
        }}
      >
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    </Box>
  );
}
