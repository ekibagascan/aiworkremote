import * as api from "../api";
import {
  FETCH_POSTS,
  FETCH_POST,
  FETCH_BY_TAG,
  FETCH_BY_CATEGORY,
  UPDATE,
  CREATE_POST,
  DELETE,
  START_LOADING,
  END_LOADING,
  FETCH_UPWORK_JOBS,
} from "../constants/actionTypes";
import { supabase } from "../supabase";
import axios from "axios";

export const getPosts = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });

    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        post_tags (
          tags (
            name
          )
        )
      `
      )
      .eq("is_verified", true) // Only get verified posts
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to get tags in the expected format
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.post_tags?.map((pt) => pt.tags.name) || [],
    }));

    // Fetch Upwork jobs
    dispatch(fetchUpworkJobs());

    dispatch({ type: FETCH_POSTS, payload: transformedPosts });
  } catch (error) {
    console.error("[Posts] Error fetching posts:", error);
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: { post: data } });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    // First, create the post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          company_name: post.company_name,
          title: post.title,
          category: post.category,
          location: post.location,
          job_type: post.job_type,
          company_logo_url: post.company_logo_url,
          salary_range: post.salary_range,
          description: post.description,
          apply_url: post.apply_url,
          x_username: post.x_username,
        },
      ])
      .select()
      .single();

    if (postError) throw postError;

    // Handle tags
    if (post.tags && post.tags.length > 0) {
      // First ensure all tags exist in the tags table
      const { data: existingTags, error: existingTagsError } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", post.tags);

      if (existingTagsError) throw existingTagsError;

      // Find which tags need to be created
      const existingTagNames = existingTags.map((tag) => tag.name);
      const newTagNames = post.tags.filter(
        (tag) => !existingTagNames.includes(tag)
      );

      // Create any new tags
      let newTags = [];
      if (newTagNames.length > 0) {
        const { data: createdTags, error: createTagsError } = await supabase
          .from("tags")
          .insert(newTagNames.map((name) => ({ name })))
          .select("id, name");

        if (createTagsError) throw createTagsError;
        newTags = createdTags;
      }

      // Combine existing and new tags
      const allTags = [...existingTags, ...newTags];

      // Create post_tags relationships
      const postTags = allTags.map((tag) => ({
        post_id: postData.id,
        tag_id: tag.id,
      }));

      const { error: relationError } = await supabase
        .from("post_tags")
        .insert(postTags);

      if (relationError) throw relationError;
    }

    dispatch({ type: CREATE_POST, payload: postData });
    navigate(`/remote-ai/postjob/${postData.id}`);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const getPostsByTag = (tagName) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    console.log("[Posts] Fetching posts for tag:", tagName);

    // First get the tag ID
    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .single();

    if (tagError) {
      console.error("[Posts] Tag not found:", tagName);
      dispatch({ type: FETCH_BY_TAG, payload: [], tag: null });
      return;
    }

    // Then get all posts that have this tag
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories:category (
          name,
          sticker
        ),
        post_tags!inner (
          tags!inner (
            name
          )
        )
      `
      )
      .eq("post_tags.tag_id", tagData.id)
      .eq("is_verified", true) // Only get verified posts
      .order("created_at", { ascending: false });

    if (postsError) throw postsError;

    // Transform the data to get tags in the expected format
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.post_tags?.map((pt) => pt.tags.name) || [],
    }));

    console.log("[Posts] Found posts:", transformedPosts.length);
    dispatch({ type: FETCH_BY_TAG, payload: transformedPosts, tag: tagName });
  } catch (error) {
    console.error("[Posts] Error fetching posts by tag:", error);
    dispatch({ type: FETCH_BY_TAG, payload: [], tag: null });
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const getPostsByCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    console.log("[Posts] Fetching posts for category:", categoryId);

    // If categoryId is null or "ALL", fetch all posts
    if (!categoryId || categoryId === "ALL") {
      return dispatch(getPosts());
    }

    // First, verify if the category exists and get its ID
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", categoryId)
      .single();

    if (categoryError) {
      console.error("[Posts] Category not found:", categoryId);
      dispatch({ type: FETCH_BY_CATEGORY, payload: [] });
      return;
    }

    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories:category (
          name,
          sticker
        ),
        post_tags (
          tags (
            name
          )
        )
      `
      )
      .eq("category", categoryData.id)
      .eq("is_verified", true) // Only get verified posts
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to get tags in the expected format
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.post_tags?.map((pt) => pt.tags.name) || [],
    }));

    console.log("[Posts] Found posts:", transformedPosts.length);
    dispatch({ type: FETCH_BY_CATEGORY, payload: transformedPosts });
  } catch (error) {
    console.error("[Posts] Error fetching posts by category:", error);
    // Return empty array on error to avoid showing incorrect posts
    dispatch({ type: FETCH_BY_CATEGORY, payload: [] });
  } finally {
    dispatch({ type: END_LOADING });
  }
};

// Function to strip HTML tags and decode HTML entities
const stripHtml = (html) => {
  if (!html) return "";

  // First decode HTML entities
  const decoded = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Then remove HTML tags and normalize whitespace
  return decoded
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const fetchUpworkJobs = () => async (dispatch) => {
  try {
    const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

    if (!apiKey) {
      console.error("RapidAPI key is not defined in environment variables");
      return;
    }

    const options = {
      method: "GET",
      url: "https://remote-jobs1.p.rapidapi.com/jobs",
      params: {
        offset: "0",
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "remote-jobs1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("Raw Remote Jobs Response:", response.data);

    // More specific AI-related keywords
    const aiKeywords = [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "neural network",
      "data science",
      "nlp",
      "computer vision",
      "ai engineer",
      "ml engineer",
      "data scientist",
      "ai researcher",
      "ai developer",
      "ai architect",
      "ai specialist",
      "ai consultant",
    ];

    // Ensure we have an array of jobs
    const jobs = Array.isArray(response.data) ? response.data : [];

    const upworkJobs = jobs
      .filter((job) => {
        if (!job) return false;
        // Strip HTML from text before searching
        const jobText = `${job.title || ""} ${
          stripHtml(job.description) || ""
        } ${job.category || ""} ${job.skills || ""}`.toLowerCase();
        // Check if any AI keyword is in the job text
        return aiKeywords.some((keyword) =>
          jobText.includes(keyword.toLowerCase())
        );
      })
      .map((job) => {
        // Simple company name handling
        const companyName = job.company?.name || job.company || "AI Company";

        // Handle job type
        let jobType = "Full-time";
        if (job.type) {
          jobType = job.type;
        } else if (job.employment_type) {
          jobType = job.employment_type;
        } else if (job.employmentType) {
          jobType = job.employmentType;
        }

        // Handle location
        let location = "Remote";
        if (job.location) {
          location = job.location;
        } else if (job.city && job.country) {
          location = `${job.city}, ${job.country}`;
        } else if (job.country) {
          location = job.country;
        }

        // Handle salary range
        let salaryRange = "See on Remote Jobs";
        if (job.salary) {
          salaryRange = job.salary;
        } else if (job.salary_range) {
          salaryRange = job.salary_range;
        } else if (job.salary_min && job.salary_max) {
          salaryRange = `$${job.salary_min} - $${job.salary_max}`;
        } else if (job.salary_min) {
          salaryRange = `From $${job.salary_min}`;
        } else if (job.salary_max) {
          salaryRange = `Up to $${job.salary_max}`;
        }

        return {
          id: `remote-${job.id || Math.random()}`,
          company_name: companyName,
          title: String(job.title || "AI Position"),
          description: stripHtml(job.description) || "No description available",
          salary_range: salaryRange,
          job_type: jobType,
          location: location,
          category: "AI & Machine Learning",
          company_logo_url: "/images/remotenft.png",
          apply_url: String(job.url || ""),
          created_at: String(job.datePosted || new Date().toISOString()),
          is_verified: true,
          source: "remote",
          job_details: {
            employmentType: jobType,
            experience: String(job.experience || "Not specified"),
            skills: Array.isArray(job.skills)
              ? job.skills
              : [String(job.skills || "")],
            benefits: Array.isArray(job.benefits)
              ? job.benefits
              : [String(job.benefits || "")],
          },
        };
      });

    console.log("Filtered AI Remote jobs:", upworkJobs.length);
    dispatch({ type: FETCH_UPWORK_JOBS, payload: upworkJobs });
  } catch (error) {
    console.error("Error fetching Remote jobs:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          }
        : "No response data",
    });
  }
};
