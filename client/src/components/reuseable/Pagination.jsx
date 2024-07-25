import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationRounded({ spacing, count, onChange }) {
  return (
    <Stack spacing={spacing}>
      <Pagination count={count} defaultPage={1} variant="outlined" shape="rounded" onChange={onChange} />
    </Stack>
  );
}
