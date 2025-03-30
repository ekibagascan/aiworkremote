import React from "react";
import {
  Grid,
  Typography,
  Chip,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Paper,
  Container,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Reuse your existing styled components
const MyCard = styled(Card)(({ theme }) => ({
  maxHeight: "106px",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  background: "transparent",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    maxHeight: 100,
  },
}));

const CardActionAreaStyled = styled(CardActionArea)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: "transparent",
  padding: "8px",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const Media = styled(CardMedia)(({ theme }) => ({
  maxWidth: 100,
  padding: "8px",
  borderRadius: "12px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: 90,
  },
}));

const ChipBottom = styled(Chip)(({ theme }) => ({
  margin: "3px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  fontSize: "0.65rem",
  height: "24px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  borderRadius: "16px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
}));

const UpworkBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
  backgroundColor: "#6fda44", // Upwork green
  color: "white",
  fontWeight: 500,
}));

const UpworkJobList = ({ jobs }) => {
  const handleJobClick = (url) => {
    window.open(url, "_blank");
  };

  if (!jobs?.length) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Typography variant="h6" color="textSecondary">
          No Upwork jobs found
        </Typography>
      </Grid>
    );
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={{ xs: 0, md: 1 }} sx={{ margin: "20px 0px" }}>
        {jobs.map((job) => (
          <Grid key={job.id} item xs={12} sx={{ marginTop: "10px" }}>
            <Paper
              elevation={0}
              sx={{
                background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <UpworkBadge size="small" label="Upwork" />
              <CardActionAreaStyled
                onClick={() => handleJobClick(job.apply_url)}
              >
                <MyCard sx={{ display: "flex", background: "transparent" }}>
                  <Media
                    component="img"
                    sx={{
                      padding: 1,
                      borderRadius: "12px",
                      objectFit: "cover",
                      backgroundColor: "#ffffff",
                    }}
                    image={job.company_logo_url}
                    alt={job.company_name}
                  />

                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                      padding: 1,
                      paddingBottom: "8px !important",
                      margin: "auto",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {job.company_name}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                      {job.title}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <ChipBottom size="small" label={job.location} />
                      <ChipBottom size="small" label={job.job_type} />
                      {job.salary_range && (
                        <ChipBottom
                          size="small"
                          label={job.salary_range}
                          sx={{
                            backgroundColor: "#66BB6A",
                            color: "#fff",
                            boxShadow: "0 2px 4px rgba(102, 187, 106, 0.3)",
                            "&:hover": {
                              backgroundColor: "#66BB6A",
                              boxShadow: "0 4px 8px rgba(102, 187, 106, 0.4)",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </MyCard>
              </CardActionAreaStyled>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UpworkJobList;
