import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { tripItemStatusOptions, tripItemTypeOptions } from "../constants/tripItemConstants.js";

function TripItemForm({
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
          label="Item title"
          name="title"
          value={formData.title}
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
            select
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={onChange}
          >
            <MenuItem value="" disabled>
              Select a type
            </MenuItem>

            {tripItemTypeOptions.map((typeOption) => (
              <MenuItem key={typeOption.value} value={typeOption.value}>
                {typeOption.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={onChange}
          >
            {tripItemStatusOptions.map((statusOption) => (
              <MenuItem key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

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
            label="Start date and time"
            name="startDateTime"
            type="datetime-local"
            value={formData.startDateTime}
            onChange={onChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: "1900-01-01T00:00",
                max: "2100-12-31T23:59",
              },
            }}
          />

          <TextField
            fullWidth
            label="End date and time"
            name="endDateTime"
            type="datetime-local"
            value={formData.endDateTime}
            onChange={onChange}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              htmlInput: {
                min: "1900-01-01T00:00",
                max: "2100-12-31T23:59",
              },
            }}
          />
        </Stack>

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
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
            fullWidth
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={onChange}
          />

          <TextField
            fullWidth
            label="Booking reference"
            name="bookingReference"
            value={formData.bookingReference}
            onChange={onChange}
          />
        </Stack>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Cost"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={onChange}
            inputProps={{
              min: 0,
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
              Delete item
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

export default TripItemForm;
