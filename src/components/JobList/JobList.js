import React, { useState, useEffect } from "react";
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
import CollapseDetails from "../CollapseDetails/CollapseDetails";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { supabase } from "../../supabase";

import { getPostsByCategory, getPostsByTag } from "../../actions/posts";

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

const Name = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
  },
}));

const Position = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: "4px",
  color: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));

const ChipBottom = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ChipRight = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  margin: "3px",
  display: "inline-flex",
  [theme.breakpoints.down("sm")]: {
    display: "inline-flex",
  },
}));

const ChipGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "4px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "flex-start",
  },
}));

const MyGrid = styled(Grid)(({ theme }) => ({
  paddingBottom: 1,
  paddingRight: 1,
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
}));

const MyContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
}));

// Function to generate a light background color for cards
const generateBackgroundColor = (companyName) => {
  // Handle null/undefined company names
  if (!companyName) {
    return "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)"; // Default light slate
  }

  const colors = [
    "linear-gradient(145deg, #f0f7ff 0%, #e3f2ff 100%)", // Soft blue
    "linear-gradient(145deg, #fff5f5 0%, #ffe3e3 100%)", // Soft red
    "linear-gradient(145deg, #f3f9f1 0%, #e6f4e1 100%)", // Soft green
    "linear-gradient(145deg, #fff8f0 0%, #ffe8d1 100%)", // Soft orange
    "linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)", // Soft purple
    "linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%)", // Light cyan
    "linear-gradient(145deg, #fdf2f8 0%, #fce7f3 100%)", // Light pink
    "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)", // Light slate
  ];

  // Generate a hash from the company name
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to select a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const JobList = ({ posts }) => {
  console.log("JobList received posts:", posts);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, sticker");

        if (error) throw error;

        // Create a map of category IDs to their names and stickers
        const categoryMap = data.reduce((acc, cat) => {
          acc[cat.id] = { name: cat.name, sticker: cat.sticker };
          return acc;
        }, {});

        setCategories(categoryMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (id) => {
    if (currentId === id) {
      // If clicking the same job, toggle its expanded state
      setExpanded(!expanded);
    } else {
      // If clicking a different job, expand it and update currentId
      setCurrentId(id);
      setExpanded(true);
    }
  };

  const handleSearchTag = (tag) => {
    console.log("[JobList] Searching for tag:", tag);
    dispatch(getPostsByTag(tag));
    navigate(`/remote-ai/tags/${tag}`, { replace: false });
  };

  const handleSearchCategory = (category) => {
    console.log("[JobList] Searching for category:", category);
    dispatch(getPostsByCategory(category));
    navigate(`/remote-ai/categories/${category}`, { replace: false });
  };

  if (!posts?.length) {
    console.log("No posts available in JobList");
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Typography variant="h6" color="white">
          No posts found
        </Typography>
      </Grid>
    );
  }

  return (
    <MyContainer maxWidth="md">
      <Grid
        container
        alignitems="center"
        justifyContent="center"
        spacing={{ xs: 0, md: 1 }}
        sx={{ margin: "20px 0px" }}
      >
        {posts.map((post) => {
          console.log("Full post object:", JSON.stringify(post, null, 2));
          console.log(
            "Categories object:",
            JSON.stringify(post.categories, null, 2)
          );
          console.log("Tags array:", JSON.stringify(post.tags, null, 2));

          return (
            <MyGrid key={post.id} item xs={12} sx={{ marginTop: "10px" }}>
              <Paper
                elevation={0}
                sx={{
                  background: generateBackgroundColor(post.company_name),
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <CardActionAreaStyled>
                  <MyCard
                    sx={{
                      display: "flex",
                      background: "transparent",
                    }}
                    onClick={() => handleClick(post.id)}
                  >
                    <Media
                      component="img"
                      sx={{
                        padding: 1,
                        borderRadius: "12px",
                        objectFit: "cover",
                        backgroundColor: "#ffffff",
                      }}
                      image={post.company_logo_url}
                      alt={post.company_name}
                    />

                    <CardContent
                      sx={{
                        flex: "1 0 auto",
                        padding: 1,
                        paddingBottom: "8px",
                        margin: "auto",
                        display: "flex",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Name variant="body1">{post.company_name}</Name>
                        <Position variant="h6">{post.title}</Position>

                        <Grid container>
                          <Grid item xs={12}>
                            {post.job_type && (
                              <ChipBottom
                                label={post.job_type}
                                size="small"
                                sx={{
                                  margin: "3px",
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                }}
                              />
                            )}
                            {post.location && (
                              <ChipBottom
                                label={post.location}
                                size="small"
                                sx={{
                                  margin: "3px",
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                }}
                              />
                            )}
                            {post.salary_range && (
                              <ChipBottom
                                label={post.salary_range}
                                size="small"
                                sx={{
                                  margin: "3px",
                                  backgroundColor: "#66BB6A",
                                  color: "#fff",
                                  boxShadow:
                                    "0 2px 4px rgba(102, 187, 106, 0.3)",
                                  "&:hover": {
                                    backgroundColor: "#66BB6A",
                                    boxShadow:
                                      "0 4px 8px rgba(102, 187, 106, 0.4)",
                                  },
                                }}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: "6px",
                          width: "300px",
                          marginRight: "10px",
                          marginTop: "auto",
                          marginBottom: "auto",
                          "& .MuiChip-root": {
                            margin: "2px",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            height: "32px",
                            "& .MuiChip-label": {
                              fontSize: "0.875rem",
                            },
                          },
                        }}
                      >
                        {post.category && categories[post.category] && (
                          <ChipRight
                            variant="outlined"
                            label={`${
                              categories[post.category].sticker || ""
                            } ${categories[post.category].name}`}
                            size="medium"
                            onClick={() =>
                              handleSearchCategory(
                                categories[post.category].name
                              )
                            }
                          />
                        )}

                        {post.tags &&
                          post.tags
                            .slice(0, 3)
                            .map((tag) => (
                              <ChipRight
                                key={tag}
                                label={tag}
                                variant="outlined"
                                size="medium"
                                onClick={() => handleSearchTag(tag)}
                              />
                            ))}
                      </Box>
                    </CardContent>
                  </MyCard>
                </CardActionAreaStyled>
              </Paper>
              {currentId === post.id && (
                <Paper
                  elevation={3}
                  sx={{
                    mt: 1,
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                >
                  <CollapseDetails
                    expanded={expanded}
                    currentId={currentId}
                    post={post}
                  />
                </Paper>
              )}
            </MyGrid>
          );
        })}
      </Grid>
    </MyContainer>
  );
};

export default JobList;
