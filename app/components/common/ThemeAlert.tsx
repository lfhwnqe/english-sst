"use client";

import { Alert, AlertProps, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAlert = styled(Alert)(() => ({
  "&.MuiAlert-standardSuccess": {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "rgb(59, 130, 246)",
    "& .MuiAlert-icon": {
      color: "rgb(59, 130, 246)",
    },
    "@media (prefers-color-scheme: dark)": {
      backgroundColor: "rgba(96, 165, 250, 0.1)",
      color: "rgb(96, 165, 250)",
      "& .MuiAlert-icon": {
        color: "rgb(96, 165, 250)",
      },
    },
  },
  "&.MuiAlert-standardError": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "rgb(239, 68, 68)",
    "& .MuiAlert-icon": {
      color: "rgb(239, 68, 68)",
    },
    "@media (prefers-color-scheme: dark)": {
      backgroundColor: "rgba(248, 113, 113, 0.1)",
      color: "rgb(248, 113, 113)",
      "& .MuiAlert-icon": {
        color: "rgb(248, 113, 113)",
      },
    },
  },
}));

interface ThemeAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: AlertProps["severity"];
  autoHideDuration?: number;
}

export default function ThemeAlert({
  open,
  onClose,
  message,
  severity = "success",
  autoHideDuration = 3000,
}: ThemeAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <StyledAlert
        onClose={onClose}
        severity={severity}
        variant="standard"
        sx={{ width: "100%" }}
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
}
