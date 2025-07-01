/* ---------- src/components/FileFieldMUI.jsx ---------- */
"use client";
import { useId } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
} from "@mui/material";

export default function FileField({
  label,
  value,
  onChange,
  accept,
  multiple = false,
}) {
  const id = useId();
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderStyle: "dashed",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" component="label">
          Choose file{multiple ? "s" : ""}
          <input
            id={id}
            type="file"
            hidden
            accept={Object.keys(accept).join(",")}
            multiple={multiple}
            onChange={(e) =>
              onChange(multiple ? [...e.target.files] : e.target.files[0])
            }
          />
        </Button>

        {value && (multiple ? value.length : 1) ? (
          <List dense>
            {(multiple ? value : [value]).map((f) => (
              <ListItem key={f.name} sx={{ p: 0 }}>
                {f.name}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No file chosen
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
