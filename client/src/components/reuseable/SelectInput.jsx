import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

export default function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  required,
}) {
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
      borderRadius: 2,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #9ca3af",
      fontSize: 16,
      padding: "10.5px 26px 10.5px 12px",
      "&:focus": {
        borderRadius: 2,
        border: "1px solid #F99F1C",
      },
    },
  }));

  return (
    <Select
      id="demo-simple-select-autowidth"
      value={value}
      onChange={onChange}
      autoWidth
      fullWidth
      displayEmpty
      required={required || false}
      MenuProps={{
        PaperProps: {
          style: {
            width: "300px",
          },
        },
      }}
      input={<BootstrapInput />}
    >
      <MenuItem disabled value="">
        {placeholder}
      </MenuItem>
      {options.map((opt, index) => (
        <MenuItem key={index} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
