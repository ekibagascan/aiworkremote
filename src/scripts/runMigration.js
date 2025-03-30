const { supabase } = require("../supabase");

const migrateTags = async () => {
  try {
    // 1. Get all posts with tags
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, tags")
      .not("tags", "is", null);

    if (postsError) throw postsError;

    // 2. Get all unique tags from posts
    const uniqueTags = [...new Set(posts.flatMap((post) => post.tags || []))];
    console.log("Found unique tags:", uniqueTags);

    // 3. Insert unique tags into tags table if they don't exist
    for (const tagName of uniqueTags) {
      const { error: upsertError } = await supabase
        .from("tags")
        .upsert({ name: tagName }, { onConflict: "name" });

      if (upsertError) {
        console.error(`Error upserting tag ${tagName}:`, upsertError);
        continue;
      }
    }

    // 4. Get all tags with their IDs
    const { data: allTags, error: allTagsError } = await supabase
      .from("tags")
      .select("id, name");

    if (allTagsError) throw allTagsError;

    // 5. Create post_tags relationships
    const tagMap = Object.fromEntries(allTags.map((tag) => [tag.name, tag.id]));

    for (const post of posts) {
      if (!post.tags) continue;

      const postTags = post.tags
        .filter((tagName) => tagMap[tagName]) // Only include tags that exist
        .map((tagName) => ({
          post_id: post.id,
          tag_id: tagMap[tagName],
        }));

      if (postTags.length > 0) {
        const { error: relationError } = await supabase
          .from("post_tags")
          .upsert(postTags, { onConflict: ["post_id", "tag_id"] });

        if (relationError) {
          console.error(
            `Error creating relationships for post ${post.id}:`,
            relationError
          );
          continue;
        }
      }
    }

    return { success: true, message: "Tags migration completed successfully" };
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error };
  }
};

const runMigration = async () => {
  console.log("Starting tags migration...");

  try {
    const result = await migrateTags();

    if (result.success) {
      console.log("Migration completed successfully!");
      console.log(result.message);
    } else {
      console.error("Migration failed:", result.error);
    }
  } catch (error) {
    console.error("Migration failed with error:", error);
  }
};

runMigration();
