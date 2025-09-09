// atoms/UploadInput.jsx
import * as React from "react";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import DSBox from "./DSBox";
import AppButton from "./AppButton";
import TypographyX from "./TypographyX";
import { getIcon } from "../utils/icons";
import { get } from "lodash";


export default function UploadInput({
  name,
  value,
  onChange,
  multiple = false,
  accept,            // e.g. "image/*,.pdf"
  maxFiles,          // number
  maxSizeMB,         // number
  disabled,
  required,
  error,
  helperText,
  showList = true,
}) {
  const inputRef = React.useRef(null);

  const pick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let next = multiple ? [...(Array.isArray(value) ? value : [])] : null;

    files.forEach((f) => {
      if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) return;
      if (multiple) next.push(f);
      else next = f;
    });

    if (multiple && maxFiles && next.length > maxFiles) {
      next = next.slice(0, maxFiles);
    }
    onChange?.(next);
    // reset input so re-selecting same file works
    e.target.value = "";
  };

  const removeAt = (idx) => {
    if (!multiple) onChange?.(null);
    else {
      const arr = Array.isArray(value) ? value.slice() : [];
      arr.splice(idx, 1);
      onChange?.(arr);
    }
  };

  const browse = () => inputRef.current?.click();

  const files = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

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

      {helperText || error ? (
        <TypographyX variant="caption" sx={{ ml: 1, color: error ? "error.main" : "text.secondary" }}>
          {helperText}
        </TypographyX>
      ) : null}

      {showList && files.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {files.map((f, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton edge="end" aria-label="remove" onClick={() => removeAt(i)}>
                  {getIcon("deleteIcon")}
                </IconButton>
              }
            >
              <ListItemText
                primary={f.name}
                secondary={`${(f.size / (1024 * 1024)).toFixed(2)} MB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </DSBox>
  );
}
