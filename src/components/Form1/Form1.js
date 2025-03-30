import React, { useState, useEffect } from "react";
import { Paper, TextField, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";
import { supabase } from "../../supabase";

const InputField = styled(TextField)({
  "& label": {
    fontSize: "1rem",
  },
  "& input:valid + fieldset": {
    borderColor: "black",
    borderWidth: 2,
  },
  "& input:invalid + fieldset": {
    borderColor: "red",
    borderWidth: 2,
  },
  "& input:valid:focus + fieldset": {
    borderLeftWidth: 6,
    padding: "4px !important",
  },
});

const AutoField = styled(TextField)(() => ({
  "& label": {
    fontSize: "1rem",
  },
  "& fieldset": {
    borderColor: "black",
    borderWidth: 2,
  },
  "& fieldset:focus": {
    borderLeftWidth: 6,
    padding: "4px !important",
  },
}));

const Form1 = ({ postData, setPostData }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      setTags(data.map((tag) => tag.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleChangeCategory = (event, value) => {
    const categoryId = value ? value.id : null;
    const categoryDisplay = value
      ? `${value.sticker || ""} ${value.name}`.trim()
      : null;
    setPostData({ ...postData, category: categoryId, categoryDisplay });
  };

  const handleAddTag = async (event, values) => {
    // Store the tag names in postData for form state
    setPostData({ ...postData, tags: values });

    // For each new tag that doesn't exist in our tags table, create it
    const newTags = values.filter((tag) => !tags.includes(tag));

    if (newTags.length > 0) {
      try {
        // Insert new tags into the tags table
        const { data, error } = await supabase
          .from("tags")
          .insert(newTags.map((tag) => ({ name: tag })))
          .select();

        if (error) throw error;

        // Update the tags list in state
        fetchTags();
      } catch (error) {
        console.error("Error creating new tags:", error);
      }
    }
  };

  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
      <InputField
        label="Company/Project Name"
        required
        value={postData.name}
        onChange={(e) => setPostData({ ...postData, name: e.target.value })}
        helperText="Your company or name of your project "
        sx={{ margin: "8px auto", width: "100%" }}
      />
      <InputField
        label="POSITION"
        required
        value={postData.position}
        onChange={(e) => setPostData({ ...postData, position: e.target.value })}
        sx={{ margin: "8px auto", width: "100%" }}
        helperText='Please specify as single job position like "Designer" or "Artist", not a sentence like "Looking for PM / Dev / Manager". We know your job is important but please DO NOT WRITE IN FULL CAPS.'
      />
      <Autocomplete
        id="primary-tag"
        options={categories}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : `${option.sticker || ""} ${option.name}`
        }
        isOptionEqualToValue={(option, value) =>
          option.id === (value?.id || value)
        }
        value={categories.find((cat) => cat.id === postData.category) || null}
        onChange={handleChangeCategory}
        fullWidth
        renderInput={(params) => (
          <AutoField
            sx={{ margin: "8px auto", width: "100%" }}
            required
            {...params}
            label="Category"
            helperText="This Category shows first and increases visibility in the main sections. Your job is shown on every page that is tagged with though."
          />
        )}
      />
      <Autocomplete
        multiple
        freeSolo
        limitTags={5}
        id="tags"
        fullWidth
        options={tags}
        value={[...postData.tags]}
        onChange={handleAddTag}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <AutoField
            sx={{ margin: "8px auto", width: "100%" }}
            {...params}
            label="Tags"
            placeholder="Type to search or add new tags"
            helperText="Select from existing tags or type new ones. The first 3 tags are shown on the job card. Separate multiple tags by pressing Enter."
          />
        )}
      />
      <InputField
        label="JOB IS RESTRICTED TO LOCATION?"
        value={postData.location}
        onChange={(e) => setPostData({ ...postData, location: e.target.value })}
        sx={{ margin: "8px auto", width: "100%" }}
        helperText="If you'd only like to hire people from a specific location or timezone this remote job is restricted to (e.g. Europe, United States or CET Timezone). If not restricted, please leave it as Worldwide."
      />
      <InputField
        label="JOB TYPE"
        value={postData.type}
        onChange={(e) => setPostData({ ...postData, type: e.target.value })}
        sx={{ margin: "8px auto", width: "100%" }}
        helperText="This is for information about your job type, whether is contract, fulltime or part-time."
      />
      <InputField
        label="X username"
        value={postData.twitterUsername}
        onChange={(e) =>
          setPostData({ ...postData, twitterUsername: e.target.value })
        }
        sx={{ margin: "8px auto", width: "100%" }}
        helperText="X username without @. Not required, but used to tag your company when we tweet out your job post."
      />
    </Paper>
  );
};

export default Form1;
