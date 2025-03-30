import { supabase } from "../supabase";

export const migrateTags = async () => {
  try {
    // 1. Get all posts with tags
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, tags")
      .not("tags", "is", null);

    if (postsError) throw postsError;

    // 2. Get all unique tags from posts
    const uniqueTags = [...new Set(posts.flatMap((post) => post.tags || []))];

    // 3. Insert unique tags into tags table if they don't exist
    const { data: existingTags, error: existingTagsError } = await supabase
      .from("tags")
      .select("name")
      .in("name", uniqueTags);

    if (existingTagsError) throw existingTagsError;

    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTags = uniqueTags.filter((tag) => !existingTagNames.includes(tag));

    if (newTags.length > 0) {
      const { error: insertTagsError } = await supabase
        .from("tags")
        .insert(newTags.map((name) => ({ name })));

      if (insertTagsError) throw insertTagsError;
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

      const postTags = post.tags.map((tagName) => ({
        post_id: post.id,
        tag_id: tagMap[tagName],
      }));

      const { error: relationError } = await supabase
        .from("post_tags")
        .insert(postTags);

      if (relationError) throw relationError;
    }

    // 6. After successful migration, we could optionally clear the tags array
    // Uncomment this if you want to clear the old tags arrays
    /*
    const { error: clearTagsError } = await supabase
      .from('posts')
      .update({ tags: null })
      .not('tags', 'is', null);

    if (clearTagsError) throw clearTagsError;
    */

    return { success: true, message: "Tags migration completed successfully" };
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error };
  }
};
