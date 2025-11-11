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
import DomainIcon from "@mui/icons-material/Domain";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Dummy Landing page for Enterprise module
 * - Responsive layout
 * - Top header with title and actions
 * - Statistics row
 * - Quick action cards
 * - Recent items list (dummy)
 */

const stats = [
  { id: "total-enterprises", label: "Total Enterprises", value: 1284, icon: DomainIcon },
  { id: "active-surveys", label: "Active Surveys", value: 42, icon: AssessmentIcon },
  { id: "members", label: "Registered Members", value: 9421, icon: PeopleIcon },
];

const quickActions = [
  { id: "search", title: "Search Enterprise", desc: "Find enterprise by code or name", btn: "Search", icon: SearchIcon, to: "/enterprise/search" },
  { id: "register", title: "Register Enterprise", desc: "Create new enterprise profile", btn: "Create", icon: DomainIcon, to: "/enterprise/create" },
  { id: "reports", title: "Reports", desc: "View enterprise reports", btn: "Open", icon: AssessmentIcon, to: "/enterprise/reports" },
];
// list of enterprise forms to navigate to
const enterpriseForms = [
  { name: "Individual Enterprise Activity Create/Update", path: "/enterprise/individual_enterprises_activity_update" },
  { name: "LC Activity Addition Form", path: "/enterprise/lc_activity_addition" },
  { name: "CBO Level Enterprise Activity Create/Update", path: "/enterprise/cbo_enterprise_activity_update" },
  { name: "Other Enterprise Activity Create/Update", path: "/enterprise/other_enterprise_activity_update" },
  { name: "Individual Enterprise Outcome Update", path: "/enterprise/individual_enterprise_outcome" },
  { name: "CBO Level Enterprise Outcome Update", path: "/enterprise/cbo_enterprise_outcome" },
  { name: "Other Enterprise Outcome Update", path: "/enterprise/other_enterprise_outcome" },
  { name: "LC Level Monthly Business", path: "/enterprise/lc_bussiness_monthly" },
  { name: "CLF Level Monthly Business", path: "/enterprise/clf_bussiness_monthly" },
  { name: "LC CLF Business Profile Year Wise", path: "/enterprise/business_profile_clf_lc_year_wise" },
];
const recentItems = new Array(4).fill(null).map((_, i) => ({
  id: `E-${1000 + i}`,
  name: `Demo Enterprise ${i + 1}`,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

export default function Landing() {
  const history = useHistory();

  return (
    <Box sx={{ background: "#f5f7f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Enterprise Module
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => history.push("/dashboard")}>Back to Dashboard</Button>
            <Button variant="contained" onClick={() => history.push("/enterprise/create")}>New Enterprise</Button>
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
        {/* Enterprise Forms - quick navigation to all enterprise forms */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Enterprise Forms</Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={1}>
            {enterpriseForms.map((f) => (
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
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Enterprises</Typography>
                <Button size="small" onClick={() => history.push("/enterprise/list")}>View all</Button>
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
                      <Typography variant="body2" color={r.status === "Active" ? "success.main" : "text.secondary"}>{r.status}</Typography>
                      <Button size="small" sx={{ mt: 1 }} onClick={() => history.push(`/enterprise/${r.id}`)}>Open</Button>
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
                Use the search and filters to quickly find enterprise records. Create new profiles using the "New Enterprise" button.
              </Typography>
              <Button fullWidth variant="outlined" onClick={() => history.push("/enterprise/help")}>Read docs</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
