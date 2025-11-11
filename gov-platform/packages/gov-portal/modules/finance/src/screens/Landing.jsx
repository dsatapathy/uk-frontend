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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Finance module landing page (dummy)
 */

const stats = [
  { id: "total-budget", label: "Total Budget (₹)", value: 12500000, icon: AccountBalanceIcon },
  { id: "expenditure", label: "Year-to-date Expenditure (₹)", value: 8423450, icon: AttachMoneyIcon },
  { id: "pending-payments", label: "Pending Payments", value: 128, icon: ReceiptLongIcon },
];

const quickActions = [
  { id: "search-transactions", title: "Search Transactions", desc: "Search by voucher / ledger", btn: "Search", icon: SearchIcon, to: "/finance/search" },
  { id: "create-voucher", title: "Create Voucher", desc: "Record new financial transaction", btn: "Create", icon: ReceiptLongIcon, to: "/finance/voucher/create" },
  { id: "reports", title: "Reports & Analysis", desc: "View financial reports", btn: "Open", icon: AssessmentIcon, to: "/finance/reports" },
];

const recentItems = new Array(4).fill(null).map((_, i) => ({
  id: `VCH-${5000 + i}`,
  title: `Voucher ${i + 1}`,
  amount: (i + 1) * 1250,
  status: i % 2 === 0 ? "Approved" : "Pending",
}));

export default function Landing() {
  const history = useHistory();

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Finance Module
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => history.push("/dashboard")}>Back to Dashboard</Button>
            <Button variant="contained" onClick={() => history.push("/finance/voucher/create")}>New Voucher</Button>
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
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</Typography>
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

        <Grid container spacing={2}>
          {/* Recent Vouchers */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Vouchers</Typography>
                <Button size="small" onClick={() => history.push("/finance/vouchers")}>View all</Button>
              </Box>

              <Divider sx={{ mb: 1 }} />

              <Stack spacing={1}>
                {recentItems.map((r) => (
                  <Box key={r.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, borderRadius: 1, bgcolor: "background.paper" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{r.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Code: {r.id}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color={r.status === "Approved" ? "success.main" : "warning.main"}>{r.status}</Typography>
                      <Typography variant="subtitle2" sx={{ mt: 0.5 }}>₹ {r.amount.toLocaleString()}</Typography>
                      <Button size="small" sx={{ mt: 1 }} onClick={() => history.push(`/finance/voucher/${r.id}`)}>Open</Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Help / Shortcuts */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Help & Shortcuts</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use quick actions to create vouchers, search transactions or view financial reports. This is a placeholder landing page for Finance module.
              </Typography>
              <Button fullWidth variant="outlined" onClick={() => history.push("/finance/help")}>Read docs</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}