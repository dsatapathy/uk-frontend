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
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function ReportDevPage() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, textAlign: "center" }}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <AssessmentIcon sx={{ fontSize: 64, color: "primary.main" }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reports — Work in Progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
              The reports module is under active development. This placeholder indicates
              reporting features will be available soon. Meanwhile you can return to the
              dashboard or explore other sections.
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