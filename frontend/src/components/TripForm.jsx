import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { tripStatusOptions } from "../constants/tripConstants.js";

function TripForm({
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onDelete,
  onSubmit,
  submitButtonLabel,
  showDeleteButton = false,
}) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2}>
        <TextField
          required
          fullWidth
          label="Trip title"
          name="title"
          value={formData.title}
          onChange={onChange}
        />

        <TextField
          required
          fullWidth
          label="Primary destination"
          name="destination"
          value={formData.destination}
          onChange={onChange}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            required
            fullWidth
            label="Start date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: "1900-01-01",
                max: "2100-12-31",
              },
            }}
          />

          <TextField
            required
            fullWidth
            label="End date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={onChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: "1900-01-01",
                max: "2100-12-31",
              },
            }}
          />
        </Stack>

        <TextField
          select
          fullWidth
          label="Trip status"
          name="status"
          value={formData.status}
          onChange={onChange}
        >
          {tripStatusOptions.map((statusOption) => (
            <MenuItem key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </MenuItem>
          ))}
        </TextField>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={onChange}
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />

          <TextField
            fullWidth
            label="Currency code"
            name="currencyCode"
            value={formData.currencyCode}
            onChange={onChange}
            slotProps={{
              htmlInput: {
                maxLength: 3,
                inputMode: "text",
                autoCapitalize: "characters",
              },
            }}
          />
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={onChange}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          sx={{
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            sx={{
              gap: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minHeight: 44,
                px: 3,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              {isSubmitting ? "Saving..." : submitButtonLabel}
            </Button>

            <Button
              onClick={onCancel}
              disabled={isSubmitting}
              variant="outlined"
              sx={{
                minHeight: 44,
                px: 3,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              Cancel
            </Button>
          </Stack>

          {showDeleteButton ? (
            <Button
              color="error"
              onClick={onDelete}
              variant="outlined"
              sx={{
                minHeight: 44,
                px: 3,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              Delete trip
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

export default TripForm;
