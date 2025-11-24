import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function SearchDevPage() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, textAlign: "center" }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <ConstructionIcon sx={{ fontSize: 64, color: "warning.main" }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Search Page — Work in Progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
              The search screen is currently under development. This placeholder indicates
              the feature will be available soon. You can return to the dashboard or
              explore other sections while the page is being built.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button variant="contained" onClick={() => history.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outlined" onClick={() => history.goBack()}>
                Go Back
              </Button>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="caption" color="text.secondary">
                Development in progress...
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}