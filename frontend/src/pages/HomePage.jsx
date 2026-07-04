import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const valueCards = [
  {
    title: "One home for every plan",
    description:
      "Start simple or go detailed, with trip information kept together instead of scattered across notes, apps, and emails.",
  },
  {
    title: "See what needs doing",
    description:
      "Filter by status or item type to spot what needs booking, review key details, or mark things off as you go.",
  },
  {
    title: "Take your itinerary with you",
    description:
      "Export your itinerary to PDF for easy printing, sharing, or saving to your phone before you travel.",
  },
];

const workflowSteps = [
  {
    title: "Create a trip",
    description:
      "Add the essentials, including destination, dates, status, notes, and optional budget.",
  },
  {
    title: "Build the itinerary",
    description:
      "Plan the trip's details, including transport, accommodation, activities, and more.",
  },
  {
    title: "Update and export anytime",
    description:
      "Edit plans as they change, then export the current itinerary whenever you need a copy.",
  },
];

function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const heading = isAuthenticated
    ? `Welcome back${user?.name ? `, ${user.name}` : ""}`
    : "Plan your next adventure with Voyager";

  const description = isAuthenticated
    ? "Pick up where you left off, refine an existing itinerary, or start shaping the next trip you have been dreaming about."
    : "Bring every part of your trip into one organised place, so everything is easier to manage before you leave and easier to follow while you travel.";

  return (
    <Stack spacing={{ xs: 5, md: 6 }}>
      <Box
        component="section"
        sx={{
          pt: {
            xs: 2,
            md: 3,
          },
          pb: {
            xs: 0,
            md: 1,
          },
          textAlign: "center",
          width: "100%",
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            mx: "auto",
            maxWidth: 760,
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              width: "100%",
            }}
          >
            {heading}
          </Typography>

          <Typography
            color="text.secondary"
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems="center"
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                "& .MuiButton-root": {
                  minWidth: 150,
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                },
              }}
            >
              {isAuthenticated ? (
                <>
                  <Button component={RouterLink} to="/trips" variant="contained" size="large">
                    View my trips
                  </Button>

                  <Button component={RouterLink} to="/trips/new" variant="outlined" size="large">
                    Create a trip
                  </Button>
                </>
              ) : (
                <>
                  <Button component={RouterLink} to="/register" variant="contained" size="large">
                    Create an account
                  </Button>

                  <Button component={RouterLink} to="/login" variant="outlined" size="large">
                    Log in
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box component="section" aria-labelledby="value-heading">
        <Stack spacing={3}>
          <Typography
            id="value-heading"
            component="h2"
            variant="h2"
            sx={{
              textAlign: {
                xs: "left",
                md: "center",
              },
            }}
          >
            A clearer way to organise travel
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {valueCards.map((card) => (
              <Card
                component="article"
                key={card.title}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Typography component="h3" variant="h6">
                      {card.title}
                    </Typography>

                    <Typography color="text.secondary" variant="body1">
                      {card.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Box>

      <Box component="section" aria-labelledby="workflow-heading">
        <Stack spacing={3}>
          <Typography
            id="workflow-heading"
            component="h2"
            variant="h2"
            sx={{
              textAlign: {
                xs: "left",
                md: "center",
              },
            }}
          >
            How Voyager works
          </Typography>

          <Box
            component="ol"
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              listStyle: "none",
              m: 0,
              p: 0,
            }}
          >
            {workflowSteps.map((step, index) => (
              <Card
                component="li"
                key={step.title}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Typography color="primary" fontWeight={700}>
                      Step {index + 1}
                    </Typography>

                    <Typography component="h3" variant="h6">
                      {step.title}
                    </Typography>

                    <Typography color="text.secondary" variant="body1">
                      {step.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

export default HomePage;
