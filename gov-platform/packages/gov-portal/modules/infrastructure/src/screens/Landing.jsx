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
import BusinessIcon from "@mui/icons-material/Business";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ConstructionIcon from "@mui/icons-material/Construction";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import LocationCityIcon from "@mui/icons-material/LocationCity";

/**
 * Infrastructure module landing page
 */

const stats = [
  { id: "projects", label: "Total Projects", value: 154, icon: BusinessIcon },
  { id: "ongoing", label: "Ongoing Works", value: 68, icon: EngineeringIcon },
  { id: "completed", label: "Completed Works", value: 86, icon: ConstructionIcon },
];

const quickActions = [
  { id: "search-project", title: "Search Project", desc: "Find projects by name, code or location", btn: "Search", icon: SearchIcon, to: "/infrastructure/search" },
  { id: "create-project", title: "Create New Project", desc: "Add a new infrastructure project", btn: "Create", icon: ConstructionIcon, to: "/infrastructure/create" },
  { id: "reports", title: "Project Reports", desc: "View project progress and completion reports", btn: "View", icon: AssessmentIcon, to: "/infrastructure/reports" },
];

// Infrastructure-related forms
const infraForms = [
  { name: "Collection Center Form", path: "/infrastructure/collection_center" },
  { name: "Asset Creation Form", path: "/infrastructure/asset_creation" },
  { name: "Maintenance Work Form", path: "/infrastructure/maintenance_work" },
  { name: "Work Progress Report", path: "/infrastructure/work_progress" },
  { name: "Completion Certificate Form", path: "/infrastructure/completion_certificate" },
  { name: "Quality Inspection Report", path: "/infrastructure/inspection_report" },
];

const recentItems = new Array(4).fill(null).map((_, i) => ({
  id: `INF-${100 + i}`,
  name: `Project ${i + 1}`,
  status: i % 2 === 0 ? "Ongoing" : "Completed",
}));

export default function InfrastructureLanding() {
  const history = useHistory();

  return (
    <Box sx={{ background: "#f9f9fb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Infrastructure Module
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => history.push("/dashboard")}>Back to Dashboard</Button>
            <Button variant="contained" onClick={() => history.push("/infrastructure/create")}>New Project</Button>
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

        {/* Infrastructure Forms */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Infrastructure Forms</Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={1}>
            {infraForms.map((f) => (
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
          {/* Recent Projects */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Projects</Typography>
                <Button size="small" onClick={() => history.push("/infrastructure/projects")}>View all</Button>
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
                      <Button size="small" sx={{ mt: 1 }} onClick={() => history.push(`/infrastructure/project/${r.id}`)}>Open</Button>
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
                Manage all infrastructure projects, track ongoing work, and generate detailed reports.
                Use quick actions to start new projects or monitor progress easily.
              </Typography>
              <Button fullWidth variant="outlined" onClick={() => history.push("/infrastructure/help")}>Read docs</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
