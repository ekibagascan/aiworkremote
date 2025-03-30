import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { fetchCategories, createPost } from "../../api";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Remote"];

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    company_logo_url: "",
    location: "",
    job_type: "",
    salary_range: "",
    description: "",
    requirements: "",
    category: "",
    tags: [],
    apply_url: "",
  });

  const [categories, setCategories] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data || []);
      } catch (err) {
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag],
      });
      setCurrentTag("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async () => {
    if (!isPaid) {
      setError("Please complete the payment first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createPost(formData);
      // Redirect to success page or show success message
      alert("Job posted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Post a Job
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            required
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Company Logo URL"
            name="company_logo_url"
            value={formData.company_logo_url}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            select
            label="Job Type"
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            margin="normal"
          >
            {JOB_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Salary Range"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            margin="normal"
            placeholder="e.g., $80,000 - $100,000"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Add Tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleTagAdd}>Add</Button>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            label="Application URL"
            name="apply_url"
            value={formData.apply_url}
            onChange={handleChange}
            margin="normal"
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment - $99
            </Typography>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "99.00",
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  setIsPaid(true);
                });
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !isPaid}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Post Job"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostJobForm;
