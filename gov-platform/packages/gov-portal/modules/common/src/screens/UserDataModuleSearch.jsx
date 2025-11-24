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
    return <div style={{ padding: 20 }}>❌ Invalid module search form type: {type}</div>;
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
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
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
    show("Fetching data please wait...");
    setLoading(true);
    try {
      // Step 1: Fetch count
      params.pageNo = 1;
      params.pageSize = pageSize;
      const method = "POST";
      const payload = {
        module: config.payload.module,
        operation: config.payload.operation,
        formType: config.payload.formType,
        formData: params,
      };
      const response = await apiService({ method, url: config.api.search, params: null, payload });
      const totalPages = response?.totalPages || 0;
      setTotalPages(totalPages);
      const total = (response?.data).length || 0;
      if (total === 0) {
        enqueue({ message: "No data found for given filters.", severity: "info" });
        setTableData([]);
        return;
      }
      enqueue({ message: `Found ${total} records.`, severity: "success" });

      // Step 2: Fetch first page of data
      // const payload = {
      //   ...params,
      //   limit: pageSize,
      //   offset: 0,
      // };
      // const searchRes = await apiService({ method: "POST", url: config.api.search, data: payload });
      const searchRes = config.formatResponse(response?.data || []);
      setTableData(searchRes || []);
      setSearchParams(params);
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
      const method = "POST";
      const payload = {
        module: config.payload.module,
        operation: config.payload.operation,
        formType: config.payload.formType,
        formData: { ...searchParams, pageNo: pageNumber, pageSize: pageSize },
      };
      const res = await apiService({ method, url: config.api.search, params: null, payload });
      const searchRes = config.formatResponse(res?.data || []);
      setTableData(searchRes || []);
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
    if (page >= totalPages) return;
    const newPage = page + 1;
    await fetchPageData(newPage);
    setPage(newPage);
  };

  const handlePrevPage = async () => {
    if (page <= 1) return;
    const newPage = page - 1;
    await fetchPageData(newPage);
    setPage(newPage);
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
          total={totalPages}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    </>
  );
};

export default UserDataModuleSearchPage;
