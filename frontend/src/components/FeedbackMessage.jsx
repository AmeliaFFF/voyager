import Box from "@mui/material/Box";

function FeedbackMessage({ children, severity = "error" }) {
  return (
    <Box
      role="alert"
      sx={(theme) => {
        const colours =
          severity === "success" ? theme.palette.feedback.success : theme.palette.feedback.error;

        return {
          border: "1px solid",
          borderColor: colours.border,
          borderRadius: 2,
          bgcolor: colours.background,
          color: colours.text,
          px: 2,
          py: 1.5,
        };
      }}
    >
      {children}
    </Box>
  );
}

export default FeedbackMessage;
