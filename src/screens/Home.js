import React, { useEffect } from "react";
import {
  Grid,
  Grow,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import HomeLoading from "../components/Loading/HomeLoading";
import { getPosts, getPostsByCategory } from "../actions/posts";
import Banner from "../components/Banner/Banner";
import Category from "../components/Category/Category";
import JobList from "../components/JobList/JobList";
import FloatingButton from "../components/FloatingButton/FloatingButton";

const Home = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const location = useLocation();
  const { posts, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category) {
          console.log("[Home] Fetching posts for category:", category);
          const categoryData = category === "ALL" ? null : category;
          await dispatch(getPostsByCategory(categoryData));
        } else {
          console.log("[Home] Fetching all posts");
          await dispatch(getPosts());
        }
      } catch (error) {
        console.error("[Home] Error fetching posts:", error);
      }
    };

    fetchData();
  }, [dispatch, category]);

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={0}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Banner />
          <Category currentCategory={category || "ALL"} />

          {isLoading ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <CircularProgress size={40} sx={{ color: "white" }} />
            </Grid>
          ) : !posts || posts.length === 0 ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Typography variant="h6" color="white">
                No posts available for this category
              </Typography>
            </Grid>
          ) : (
            <JobList posts={posts} />
          )}

          <FloatingButton />
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
