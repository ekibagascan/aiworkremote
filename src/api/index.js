import { supabase } from "../supabase";

// Categories
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return { data };
};

export const fetchCategory = async (name) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("name", name)
    .single();
  if (error) throw error;
  return { data };
};

// Posts
export const fetchPosts = async () => {
  try {
    console.log("Fetching posts from Supabase...");
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories:category (
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Posts fetched with categories and tags:", data);
    if (data) {
      data.forEach((post) => {
        console.log("Post categories:", post.categories);
        console.log("Post tags:", post.tags);
      });
    }
    return { data };
  } catch (error) {
    console.error("Error in fetchPosts:", error);
    throw error;
  }
};

export const fetchPost = async (id) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return { data };
};

export const createPost = async (postjob) => {
  try {
    // Validate required fields
    const requiredFields = ["title", "company_name", "description", "category"];
    for (const field of requiredFields) {
      if (!postjob[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          ...postjob,
          is_verified: false, // All new posts start as unverified
          is_featured: false, // All new posts start as non-featured
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select(
        `
        *,
        categories:category (
          name
        )
      `
      )
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

export const updatePost = async (id, updatedPost) => {
  const { data, error } = await supabase
    .from("posts")
    .update(updatedPost)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return { data };
};

export const deletePost = async (id) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
  return { message: "Post deleted successfully" };
};

export const fetchPostsByTag = async (tag) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .contains("tags", [tag])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return { data };
};

export const fetchPostsByCategory = async (categoryName) => {
  try {
    console.log("Fetching posts by category:", categoryName);
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories:category (
          name
        )
      `
      )
      .eq("categories.name", categoryName)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error in fetchPostsByCategory:", error);
      throw error;
    }

    console.log("Posts fetched by category:", data);
    return { data };
  } catch (error) {
    console.error("Error in fetchPostsByCategory:", error);
    throw error;
  }
};
