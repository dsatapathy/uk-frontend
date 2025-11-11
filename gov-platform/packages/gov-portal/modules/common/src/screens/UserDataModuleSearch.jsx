import React from "react";
import { useLocation } from "react-router-dom";
import { getComponent } from "@gov/core";
import { useSnackbar, useLoader } from "@gov/library";
import { apiService } from "@gov/data";
import PreviewIcon from "@mui/icons-material/Preview";
import { searchConfigForUserData } from "../searchConfig/searchConfigUserData";

// --- Utility to read query params ---
const useQuery = () => new URLSearchParams(useLocation().search);

// --- Common UI config for forms ---
const ui = {
  padding: 2,
  grid: { cols: { xs: 12, sm: 12 }, gap: { xs: "s2", md: "s2" } },
  stickyActions: false,
  sections: { collapsible: false, defaultOpen: true },
  sectionCard: {
    elevation: 0,
    variant: "outlined",
    sx: (theme) => ({
      p: { xs: 1.5, md: 2 },
      borderRadius: "var(--g-radius)",
      border: `1px solid ${theme.palette.divider}`,
      titleSx: { fontWeight: 600 },
    }),
  },
  fieldLayout: "top",
  fieldWrapper: { dense: true, requiredMark: "asterisk", labelWidth: 220 },
};

const UserDataModuleSearchPage = () => {
  const query = useQuery();
  const type = query.get("type") || "beneficiary";
  const config = searchConfigForUserData[type];

  if (!config) {
    return <div style={{ padding: 20 }}>❌ Invalid module type: {type}</div>;
  }

  const DynamicForm = getComponent("DynamicForm");
  const DynamicTable = getComponent("DynamicTable");
  const formApiRef = React.useRef(null);
  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();

  // -----------------------------
  // STATE MANAGEMENT
  // -----------------------------
  const [tableData, setTableData] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({});
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  // -----------------------------
  // ACTIONS FOR TABLE
  // -----------------------------
  const actions = [
    {
      label: "View",
      icon: <PreviewIcon />,
      onClick: (row) => console.log("Viewing:", row),
    },
  ];

  // -----------------------------
  // COUNT API → SEARCH API FLOW
  // -----------------------------
  const fetchCountAndData = async (params) => {
    show("Fetching record count...");
    setLoading(true);
    try {
      // Step 1: Fetch count
      const method = "GET";
      const countRes = await apiService({ method, url: config.api.count, params, payload: null });
      const total = countRes?.data?.totalCount ?? countRes?.data ?? 0;
      setTotalRecords(total);

      if (total === 0) {
        enqueue({ message: "No data found for given filters.", severity: "info" });
        setTableData([]);
        return;
      }

      enqueue({ message: `Found ${total} records. Loading first page...`, severity: "success" });

      // Step 2: Fetch first page of data
      const payload = {
        ...params,
        limit: pageSize,
        offset: 0,
      };
      const searchRes = await apiService({ method: "POST", url: config.api.search, data: payload });
      setTableData(searchRes?.data?.data || searchRes?.data || []);
      setPage(1);
    } catch (err) {
      enqueue({ message: "Failed to fetch data.", severity: "error" });
      console.error(err);
    } finally {
      hide();
      setLoading(false);
    }
  };

  // -----------------------------
  // PAGINATED SEARCH CALL ONLY
  // -----------------------------
  const fetchPageData = async (pageNumber) => {
    show("Loading page...");
    setLoading(true);
    try {
      const offset = (pageNumber - 1) * pageSize;
      const payload = { ...searchParams, limit: pageSize, offset };
      const res = await apiService.post(config.api.search, payload);
      setTableData(res?.data?.data || res?.data || []);
    } catch (err) {
      enqueue({ message: "Failed to fetch page data.", severity: "error" });
    } finally {
      hide();
      setLoading(false);
    }
  };

  // -----------------------------
  // HANDLE FORM SUBMIT
  // -----------------------------
  const handleSubmit = async (vals) => {
    setSearchParams(vals);
    await fetchCountAndData(vals);
  };

  // -----------------------------
  // PAGINATION HANDLERS
  // -----------------------------
  const handleNextPage = async () => {
    if (page * pageSize >= totalRecords) return;
    const newPage = page + 1;
    setPage(newPage);
    await fetchPageData(newPage);
  };

  const handlePrevPage = async () => {
    if (page <= 1) return;
    const newPage = page - 1;
    setPage(newPage);
    await fetchPageData(newPage);
  };

  // -----------------------------
  // ✅ UPDATED RENDER SECTION
  // -----------------------------
  return (
    <>
      <DynamicForm
        schema={config.formSchema}
        onSubmit={handleSubmit}
        formApiRef={formApiRef}
        entityId={type}
        autosaveMs={800}
        ui={ui}
        validationSchema={config.formSchema}
        defaultsSchema={config.formSchema}
        output="flat"
        footer="report"
      />

      <div
        style={{
          padding: 16,
          marginTop: 16,
          marginBottom: 40,
          border: "1px solid #ddd",
          borderRadius: 4,
        }}
      >
        {/* ✅ Use new DynamicTable props */}
        <DynamicTable
          title={config.title}
          columns={config.tableSchema}
          data={tableData}
          actions={actions}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={totalRecords}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    </>
  );
};

export default UserDataModuleSearchPage;
