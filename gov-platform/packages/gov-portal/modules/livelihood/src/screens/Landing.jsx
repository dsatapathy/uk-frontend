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
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Livelihood module landing page (dummy)
 */

const stats = [
  { id: "programs", label: "Total Programs", value: 72, icon: WorkIcon },
  { id: "trainings", label: "Active Trainings", value: 18, icon: SchoolIcon },
  { id: "participants", label: "Participants", value: 5420, icon: PeopleIcon },
];

const quickActions = [
  { id: "search-beneficiary", title: "Search Beneficiary", desc: "Find beneficiary by name or ID", btn: "Search", icon: SearchIcon, to: "/livelihood/search" },
  { id: "register-training", title: "Register Training", desc: "Create new training batch", btn: "Create", icon: SchoolIcon, to: "/livelihood/training/create" },
  { id: "reports", title: "Reports", desc: "View livelihood reports", btn: "Open", icon: WorkIcon, to: "/livelihood/reports" },
];
// list of enterprise forms to navigate to
const livelihoodForms = [
  {
    name: "Ultra Poor Package Activity LC Level",
    path: "/livelihood/ultra_poor_package_lc_level_activity",
  },
  {
    name: "Ultra Poor Package Activity CLF Level",
    path: "/livelihood/ultra_poor_package_clf_level_activity",
  },
  {
    name: "Drudgery Reduction Tool",
    path: "/livelihood/drudgery_reduction_tool",
  },
  {
    name: "Pashu Sakhi Training",
    path: "/livelihood/pashu_sakhi_training",
  },
  {
    name: "Pashu Sakhi Kit",
    path: "/livelihood/pashu_sakhi_kit",
  },
  {
    name: "Pashu Sakhi Outcome",
    path: "/livelihood/pashu_sakhi_outcome",
  },
  {
    name: "CSA Seed Order",
    path: "/livelihood/csa_seed_data_order",
  },
  {
    name: "Ultra Poor Package Outcome CLF Level",
    path: "/livelihood/ultra_poor_package_outcome_clf_level",
  },
  {
    name: "Ultra Poor Package Outcome LC Level",
    path: "/livelihood/ultra_poor_package_outcome_lc_level",
  },
];
const recentItems = new Array(4).fill(null).map((_, i) => ({
  id: `L-${2000 + i}`,
  name: `Demo Program ${i + 1}`,
  status: i % 2 === 0 ? "Ongoing" : "Completed",
}));

export default function Landing() {
  const history = useHistory();

  return (
    <Box sx={{ background: "#f6faf6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Livelihood Module
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => history.push("/dashboard")}>Back to Dashboard</Button>
            <Button variant="contained" onClick={() => history.push("/livelihood/create")}>New Program</Button>
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
        {/* Livelihood Forms - quick navigation to all enterprise forms */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Livelihood Forms</Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={1}>
            {livelihoodForms.map((f) => (
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
          {/* Recent */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Programs</Typography>
                <Button size="small" onClick={() => history.push("/livelihood/programs")}>View all</Button>
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
                      <Button size="small" sx={{ mt: 1 }} onClick={() => history.push(`/livelihood/program/${r.id}`)}>Open</Button>
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
                Use quick actions to start searches, create programs or view reports. This page is a stub for the Livelihood module.
              </Typography>
              <Button fullWidth variant="outlined" onClick={() => history.push("/livelihood/help")}>Read docs</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
