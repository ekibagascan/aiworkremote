import { useEffect, useState } from "react";
import { testConnection } from "../supabase";
import { fetchPosts } from "../api";

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState("Testing...");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const test = async () => {
      // Test basic connection
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? "Connected!" : "Connection failed");

      // Test fetching posts
      try {
        const { data } = await fetchPosts();
        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    test();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Supabase Connection Test</h2>
      <p>Status: {connectionStatus}</p>
      <h3>Posts from Database:</h3>
      {posts.length === 0 ? (
        <p>
          No posts found. You may need to create some data in your Supabase
          database.
        </p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title || "Untitled Post"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
