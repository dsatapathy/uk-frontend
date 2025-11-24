import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";

/**
 * Training module landing page
 */

const stats = [
  { id: "trainings", label: "Total Trainings", value: 128, icon: SchoolIcon },
  { id: "batches", label: "Active Batches", value: 42, icon: AssignmentIcon },
  { id: "participants", label: "Participants Trained", value: 8360, icon: PeopleIcon },
];

const quickActions = [
  { id: "search-trainee", title: "Search Trainee", desc: "Find trainees by name or ID", btn: "Search", icon: SearchIcon, to: "/training/search" },
  { id: "create-training", title: "Create Training Batch", desc: "Register new training session", btn: "Create", icon: EventIcon, to: "/training/create" },
  { id: "reports", title: "Training Reports", desc: "View all training reports", btn: "View", icon: AssessmentIcon, to: "/training/reports" },
];

// training forms for quick access
const trainingForms = [
  { name: "Farmer Climate Smart Agriculture Training ", path: "/training/farmer_climate_smart_agriculture_training" },
  { name: "Staff Performance Record", path: "/training/staff_performance_record" },
  { name: "REAP Capacity Building Record", path: "/training/reap_capacity_building_record" },
  { name: "Case Study Upload", path: "/training/case_study_upload" }
];

const recentItems = new Array(4).fill(null).map((_, i) => ({
  id: `T-${5000 + i}`,
  name: `Training Batch ${i + 1}`,
  status: i % 2 === 0 ? "Ongoing" : "Completed",
}));

export default function TrainingLanding() {
  const history = useHistory();

  return (
    <Box sx={{ background: "#f9fbff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Training Module
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => history.push("/dashboard")}>Back to Dashboard</Button>
            <Button variant="contained" onClick={() => history.push("/training/create")}>New Training</Button>
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                    <Icon fontSize="large" />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.value.toLocaleString()}</Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Quick Actions</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={a.id}>
                <Card>
                  <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <Icon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{a.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{a.desc}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => history.push(a.to)} variant="contained">{a.btn}</Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Training Forms */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Training Forms</Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={1}>
            {trainingForms.map((f) => (
              <Grid item xs={12} sm={6} md={4} key={f.path}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
                  <Typography variant="body1">{f.name}</Typography>
                  <Button size="small" variant="outlined" onClick={() => history.push(f.path)}>
                    Open
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          {/* Recent Trainings */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Training Batches</Typography>
                <Button size="small" onClick={() => history.push("/training/batches")}>View all</Button>
              </Box>

              <Divider sx={{ mb: 1 }} />

              <Stack spacing={1}>
                {recentItems.map((r) => (
                  <Box key={r.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, borderRadius: 1, bgcolor: "background.paper" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{r.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Code: {r.id}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color={r.status === "Ongoing" ? "success.main" : "text.secondary"}>{r.status}</Typography>
                      <Button size="small" sx={{ mt: 1 }} onClick={() => history.push(`/training/batch/${r.id}`)}>Open</Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Help / Tips */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Help & Tips</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use quick actions to search trainees, create new batches, or view reports. This page is designed as a starting point for the Training module.
              </Typography>
              <Button fullWidth variant="outlined" onClick={() => history.push("/training/help")}>Read docs</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
