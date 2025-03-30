import React, { useState } from "react";
import {
  Grid,
  Chip,
  Button,
  Paper,
  CardActionArea,
  CardMedia,
  CardContent,
  Card,
  Box,
  Typography,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

const Content = styled(CardContent)(({ theme }) => ({
  padding: "50px 80px",
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
  },
}));
const Title = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    marginBottom: "10px",
  },
}));
const Descriptions = styled(ReactMarkdown)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
  },
}));
const Location = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    fontWeight: 500,
  },
}));
const SubTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));
const Salaries = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    fontWeight: 500,
  },
}));

const MyPaper = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    margin: "0px auto 20px",
  },
}));

const ChipRight = styled(Chip)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const FormPreview = ({ postData }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = async (id, e) => {
    setExpanded(!expanded);
  };
  return (
    <Box
      sx={{
        marginTop: "30px",
        backgroundColor: "#FFF",
        borderRadius: "8px",
      }}
    >
      <Paper sx={{ padding: "0 16px 20px", backgroundColor: "#0F00FF" }}>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            margin: "5px auto 3px",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          Preview All
        </Typography>
        <CardActionArea
          sx={{ backgroundColor: "#0F00FF", borderRadius: "8px" }}
          onClick={handleClick}
        >
          <Card
            sx={{
              display: "flex",
              maxHeight: "106px",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                maxWidth: 100,
                padding: 1,
                borderRadius: "12px",
                objectFit: "cover",
              }}
              image={postData?.logo || "/images/remotenft.png"}
              alt="logo-preview"
            />

            <CardContent
              sx={{
                flex: "1 0 auto",
                padding: 1,
                paddingBottom: "8px",
                margin: "auto",
                marginLeft: "10px",
              }}
            >
              <Typography variant="body1">
                {postData?.name || "Project/Company"}
              </Typography>
              <Typography variant="h6">
                {postData?.position || "Position/Role Job"}
              </Typography>
              <Grid sx={{ margin: "5px auto" }}>
                <Chip
                  variant="contained"
                  size="small"
                  label={postData?.location || "Location"}
                  sx={{
                    margin: "auto 3px",
                    backgroundColor: "#e2e2e2",
                    color: "#000",
                    fontSize: "0.65rem",
                    height: "24px",
                    boxShadow: "none",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "#e2e2e2",
                      color: "#000",
                      boxShadow: "none",
                    },
                  }}
                />

                <Chip
                  variant="contained"
                  size="small"
                  label={postData?.type || "Type Job"}
                  sx={{
                    margin: "auto 3px",
                    backgroundColor: "#e2e2e2",
                    color: "#000",
                    fontSize: "0.65rem",
                    height: "24px",
                    boxShadow: "none",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "#e2e2e2",
                      color: "#000",
                      boxShadow: "none",
                    },
                  }}
                />
                {postData?.minSalary && postData?.maxSalary !== "Secret" ? (
                  <Chip
                    variant="contained"
                    size="small"
                    label={postData?.maxSalary || "$"}
                    sx={{
                      margin: "auto 3px",
                      backgroundColor: "#66BB6A",
                      fontSize: "0.65rem",
                      height: "24px",
                      boxShadow: "none",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#66BB6A",
                        boxShadow: "none",
                      },
                    }}
                  />
                ) : null}
              </Grid>
            </CardContent>
            <Grid
              item
              xs={4}
              sx={{
                margin: "auto",
                marginRight: "80px",
              }}
            >
              <ChipRight
                variant="outlined"
                label={postData?.category}
                size="medium"
                sx={{ margin: "3px" }}
              />

              {postData?.tags.map((tag) => (
                <ChipRight
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="medium"
                  sx={{ margin: "3px" }}
                />
              ))}
            </Grid>
          </Card>
        </CardActionArea>
        <Paper>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Content>
              <Title
                variant="h4"
                sx={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {postData?.name} is hiring a Remote {postData?.position}
              </Title>

              <Descriptions>{postData?.jobDescriptions}</Descriptions>

              <SubTitle
                variant="h5"
                sx={{ fontWeight: 500, marginBottom: "10px" }}
              >
                Location
              </SubTitle>

              <Location paragraph>{postData?.location}</Location>
              <SubTitle
                variant="h5"
                sx={{ fontWeight: 500, marginBottom: "10px" }}
              >
                Salary
              </SubTitle>

              <Salaries paragraph>
                {postData?.minSalary} - {postData?.maxSalary}
              </Salaries>

              <MyPaper
                elevate={1}
                sx={{
                  padding: 3,
                  textAlign: "center",
                  margin: "0px auto 50px",
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ borderRadius: "15px", backgroundColor: "#0F00FF" }}
                >
                  Apply for this job
                </Button>
              </MyPaper>
            </Content>
          </Collapse>
        </Paper>
      </Paper>
    </Box>
  );
};

export default FormPreview;
