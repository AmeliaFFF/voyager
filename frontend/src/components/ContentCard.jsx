import Paper from "@mui/material/Paper";

function ContentCard({ children, component = "section", sx = {} }) {
  return (
    <Paper
      component={component}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        p: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export default ContentCard;
