import React from "react";
import {
  Collapse,
  CardContent,
  Typography,
  Paper,
  Button,
  Link,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
const SubTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));
const Descriptions = styled(ReactMarkdown)(({ theme }) => ({
  "& p": {
    marginBottom: "1em",
    lineHeight: "1.6",
  },
  "& h1": {
    fontSize: "2em",
    marginBottom: "0.5em",
  },
  "& h2": {
    fontSize: "1.5em",
    marginBottom: "0.5em",
  },
  "& h3": {
    fontSize: "1.17em",
    marginBottom: "0.5em",
  },
  "& ul, & ol": {
    marginLeft: "2em",
    marginBottom: "1em",
  },
  "& li": {
    marginBottom: "0.5em",
  },
  "& strong": {
    fontWeight: "bold",
  },
  "& em": {
    fontStyle: "italic",
  },
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

const CollapseDetails = ({ expanded, currentId, post }) => {
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Content>
        <Title variant="h4" sx={{ fontWeight: 500, marginBottom: "20px" }}>
          {post.company_name} is hiring a Remote {post.title}
        </Title>

        <Descriptions remarkPlugins={[remarkGfm]}>
          {post?.description || ""}
        </Descriptions>

        <SubTitle variant="h5" sx={{ fontWeight: 500, marginBottom: "10px" }}>
          Location
        </SubTitle>

        <Location paragraph>{post.location}</Location>

        {post?.salary_range && (
          <Grid>
            <SubTitle
              variant="h5"
              sx={{ fontWeight: 500, marginBottom: "10px" }}
            >
              Salary
            </SubTitle>

            <Salaries paragraph>{post.salary_range}</Salaries>
          </Grid>
        )}

        <MyPaper
          elevate={1}
          sx={{ padding: 3, textAlign: "center", margin: "0px auto 50px" }}
        >
          <Link
            href={post.apply_url}
            target="_blank"
            rel="noreferrer"
            color="inherit"
            underline="none"
          >
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ borderRadius: "15px", backgroundColor: "#0F00FF" }}
            >
              Apply for this job
            </Button>
          </Link>
        </MyPaper>
      </Content>
    </Collapse>
  );
};

export default CollapseDetails;
