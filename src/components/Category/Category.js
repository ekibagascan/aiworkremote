import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";
import { supabase } from "../../supabase";

const Category = ({ currentCategory = "ALL" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeTag } = useSelector((state) => state.posts);

  useEffect(() => {
    console.log("[Category] Component mounted");
    console.log("[Category] Current category:", currentCategory);
    console.log("[Category] Current location:", location.pathname);
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("[Category] Category prop changed:", currentCategory);
    console.log("[Category] Current location:", location.pathname);
  }, [currentCategory, location]);

  const fetchCategories = async () => {
    try {
      console.log("[Category] Fetching categories...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      console.log("[Category] Categories fetched:", data);
      setCategories(data);
    } catch (error) {
      console.error("[Category] Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    console.log("[Category] Category clicked:", { categoryId, categoryName });
    setLoading(true);

    try {
      if (categoryName === "ALL") {
        dispatch(getPosts()); // Explicitly fetch all posts when ALL is clicked
      }
      const newPath =
        categoryName === "ALL" ? "/" : `/remote-ai/categories/${categoryName}`;
      navigate(newPath, { state: { categoryId, categoryName } });
    } catch (error) {
      console.error("[Category] Navigation error:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  // Determine if ALL should be active - only if currentCategory is ALL and no tag is active
  const isAllActive = currentCategory === "ALL" && !activeTag;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={1} sx={{ marginTop: "20px" }}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="white">
            Categories
          </Typography>
          <Grid item sx={{ marginTop: "10px", position: "relative" }}>
            <Button
              size="small"
              variant="outlined"
              disabled={loading}
              sx={{
                margin: "3px",
                color: isAllActive ? "#0F00FF" : "white",
                borderColor: isAllActive
                  ? "#0F00FF"
                  : "rgba(255, 255, 255, 0.3)",
                backgroundColor: isAllActive ? "white" : "transparent",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
              onClick={() => handleCategoryClick(null, "ALL")}
            >
              🔍 ALL
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                size="small"
                variant="outlined"
                disabled={loading}
                sx={{
                  margin: "3px",
                  color:
                    currentCategory === category.name && !activeTag
                      ? "#0F00FF"
                      : "white",
                  borderColor:
                    currentCategory === category.name && !activeTag
                      ? "#0F00FF"
                      : "rgba(255, 255, 255, 0.3)",
                  backgroundColor:
                    currentCategory === category.name && !activeTag
                      ? "white"
                      : "transparent",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                {category.sticker} {category.name}
              </Button>
            ))}
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Category;
