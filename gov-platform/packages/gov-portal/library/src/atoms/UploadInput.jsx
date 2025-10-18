// atoms/UploadInput.jsx
import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DSBox from "./DSBox";
import AppButton from "./AppButton";
import TypographyX from "./TypographyX";
import { getIcon } from "../utils/icons";
import { get } from "lodash";
import { http } from "../../../data/services/bootstrap";
import { useSnackbar } from "./Snackbar";
import {useLoader} from "./Loader";
// ---------- utils ----------
const isDefined = (v) => v !== undefined && v !== null;
const isAcceptableItem = (x) =>
  x instanceof File || (x && typeof x === "object");

const toArray = (value, multiple) => {
  if (!multiple) return isAcceptableItem(value) ? [value] : [];
  if (Array.isArray(value)) return value.filter(isAcceptableItem);
  return isAcceptableItem(value) ? [value] : [];
};

const formatSize = (bytes) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return "";
  const KB = 1024, MB = KB * 1024, GB = MB * 1024;
  if (n >= GB) return `${(n / GB).toFixed(2)} GB`;
  if (n >= MB) return `${(n / MB).toFixed(2)} MB`;
  if (n >= KB) return `${(n / KB).toFixed(1)} KB`;
  return `${n} B`;
};

const downloadLocalFile = (file) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name || "download";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

// ---------- component ----------
export default function UploadInput({
  name,
  value,                  // File | Array<File> | server descriptors
  onChange,
  multiple = false,
  accept,
  maxFiles,
  maxSizeMB,
  disabled,
  required,
  error,
  helperText,
  showList = true,

  // server descriptor keys
  fileKeys = { label: "name", size: "size", url: "url", id: "id" },
  getDownloadUrl,         // (item) => url
}) {
  const inputRef = React.useRef(null);

  // Internal mirror so UI updates immediately even if parent is slow
  const [filesUI, setFilesUI] = React.useState(() => toArray(value, multiple));

  const { enqueue } = useSnackbar();
  const { show, hide } = useLoader();
  // Keep internal state in sync with parent whenever it changes
  React.useEffect(() => {
    setFilesUI(toArray(value, multiple));
  }, [value, multiple]);

  const browse = () => inputRef.current?.click();

  const emitChange = (arr) => {
    // normalize payload for parent
    const next = multiple ? arr : (arr[0] ?? null);
    console.log('next', arr, next);
    setFilesUI(arr);        // optimistic UI
    onChange?.(next);       // inform RHF/parent
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // You should get the token from your auth context, localStorage, or however your app stores it
    const token = http().getAccessToken();

    const resp = await fetch("http://reap-mis-myapp-ukgv.casacam.net:9090/reap-mis/api/files/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
        // 'Content-Type' should NOT be set when using FormData
      }
    });
    if (!resp.ok) throw new Error("File upload failed");
    const data = await resp.json();
    return data.fileId;
  };

  const pick = async (e) => {
    show("Uploading file — please wait...");
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const addable = maxSizeMB
      ? picked.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
      : picked;

    try {
      const fileDescriptors = [];
      for (const file of addable) {
        const fileId = await uploadFileToServer(file);
        fileDescriptors.push({
          id: fileId,
          name: file.name,
          size: file.size,
          // url: ... // if your API returns a download URL, add it here
        });
      }
      emitChange(multiple ? fileDescriptors : [fileDescriptors[0]]);
      // Show success snackbar
      hide();
      enqueue({ message: "File(s) uploaded successfully.", severity: "success", duration: 4000 });
    } catch (err) {
      hide();
      enqueue({ message: "File upload failed. Please try again.", severity: "error", duration: 6000 });
      console.error(err);
    }

    e.target.value = "";
  };

  const removeAt = (idx) => {
    if (!multiple) {
      emitChange([]);
      return;
    }
    const arr = filesUI.slice();
    arr.splice(idx, 1);
    emitChange(arr);
  };

  const handleDownload = (item) => {
    if (item instanceof File) {
      downloadLocalFile(item);
      return;
    }
    const url = get(item, fileKeys.url) || (typeof getDownloadUrl === "function" ? getDownloadUrl(item) : null);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = get(item, fileKeys.label) || "download";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DSBox sx={{ width: "100%" }}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        hidden
        multiple={multiple}
        accept={accept}
        onChange={pick}
        disabled={disabled}
      />

      <AppButton
        variant="outlined"
        onClick={browse}
        startIcon={getIcon("uploadFileIcon")}
        disabled={disabled}
      >
        {multiple ? "Select files" : "Select file"}
      </AppButton>

      {(helperText || error) && (
        <TypographyX
          variant="caption"
          sx={{ ml: 1, color: error ? "error.main" : "text.secondary" }}
        >
          {helperText}
        </TypographyX>
      )}

      {showList && filesUI.length > 0 && (
        <DSBox
          sx={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: 1,
            rowGap: 1,
            mt: 1,
          }}
        >
          {filesUI.map((item, i) => {
            const isFile = item instanceof File;
            const name = isFile ? item.name : (get(item, fileKeys.label) ?? "file");
            const size = isFile ? item.size : get(item, fileKeys.size);
            const hasDownload = isFile || !!get(item, fileKeys.url) || !!getDownloadUrl;
            const storedId = isFile ? null : (get(item, fileKeys.id) ?? null);
            return (

              <DSBox
                key={`${name}-${i}`}
                sx={{
                  position: "relative", // allow absolute-positioned remove button
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  px: 1.25,
                  py: 1,
                  border: (t) => `1px dashed ${t.palette.divider}`,
                  borderRadius: 1.5,
                  minWidth: 260,
                  maxWidth: "100%",
                  // backgroundColor: (t) => t.palette.background.paper,
                  backgroundColor: "#e4efe3",
                }}
              >
                {/* Remove button: small cross at top-right */}
                <IconButton
                  aria-label={`Remove ${name}`}
                  onClick={() => removeAt(i)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    bgcolor: (t) => t.palette.background.paper,
                    boxShadow: 2,
                    "&:hover": { bgcolor: (t) => t.palette.action.hover },
                    zIndex: 2,
                  }}
                >
                  {getIcon("remove")}
                </IconButton>
                <DSBox aria-hidden sx={{ display: "flex", alignItems: "center" }}>
                  {getIcon("fileIcon")}
                </DSBox>

                <DSBox sx={{ flex: 1, minWidth: 0 }}>
                  <TypographyX
                    variant="body2"
                    noWrap
                    title={name}
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {name}
                  </TypographyX>
                  <TypographyX variant="caption" color="text.secondary">
                    {formatSize(size)}
                  </TypographyX>
                  {storedId && (
                    <TypographyX variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                      ID: {storedId}
                    </TypographyX>
                  )}
                </DSBox>

                {hasDownload && (
                  <Tooltip title="Download">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(item)}
                        disabled={disabled}
                        aria-label={`Download ${name}`}
                      >
                        {getIcon("downloadIcon")}
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {/* <Tooltip title="Remove">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => removeAt(i)}
                      disabled={disabled || (required && filesUI.length === 1)}
                      aria-label={`Remove ${name}`}
                    >
                      {getIcon("deleteIcon")}
                    </IconButton>
                  </span>
                </Tooltip> */}
              </DSBox>
            );
          })}
        </DSBox>
      )}
    </DSBox>
  );
}
