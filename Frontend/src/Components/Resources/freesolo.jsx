import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export default function FreeSolo({ resources, onSearchChange }) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={resources.map((option) => option.name)}
        onInputChange={(event, value) => onSearchChange(value)}
        renderInput={(params) => (
          <TextField {...params} label="Search for resources" />
        )}
      />
    </Stack>
  );
}
