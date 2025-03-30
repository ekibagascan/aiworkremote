import { createClient } from "@supabase/supabase-js";

// Debug logs
console.log("Environment variables:", {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("count")
      .limit(1);
    if (error) {
      console.error("Supabase connection error:", error.message);
      return false;
    }
    console.log("Successfully connected to Supabase!");
    return true;
  } catch (err) {
    console.error("Error testing Supabase connection:", err.message);
    return false;
  }
};
