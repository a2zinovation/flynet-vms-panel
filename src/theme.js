// simple MUI theme consistent with your SaaS colors
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0C2548" }, // flynet deep-blue
    background: { default: "#F7F9FC", paper: "#FFFFFF" },
    text: { primary: "#0C2548", secondary: "#6B7280" },
    secondary: { main: "#00C8FF" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8 },
      },
    },
  },
});

export default theme;
