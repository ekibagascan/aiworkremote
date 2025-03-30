import React, { useState } from "react";
import {
  Grid,
  Grow,
  Container,
  Box,
  Hidden,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

import { createPost } from "../actions/posts";
import Form1 from "../components/Form1/Form1";
import Form2 from "../components/Form2/Form2";
import FormPreview1 from "../components/FormPreview/FormPreview1";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    name: "",
    position: "",
    category: "",
    tags: [],
    location: "",
    type: "",
    twitterUsername: "",
    logo: "",
    minSalary: "",
    maxSalary: "",
    jobDescriptions: "",
    applyUrl: "",
    applyEmail: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postData) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = async (details) => {
    // Format salary range
    const formattedData = {
      ...postData,
      salary_range:
        postData.minSalary && postData.maxSalary
          ? postData.minSalary === "Null"
            ? postData.maxSalary
            : postData.maxSalary === "Null"
            ? postData.minSalary
            : String(postData.minSalary).trim() ===
              String(postData.maxSalary).trim()
            ? postData.minSalary
            : `${postData.minSalary} - ${postData.maxSalary}`
          : "Competitive",
      // Clean up the data by removing individual salary fields
      minSalary: undefined,
      maxSalary: undefined,
      // Map other fields to match database columns
      company_name: postData.name,
      title: postData.position,
      category: postData.category,
      job_type: postData.type,
      company_logo_url: postData.logo,
      // Ensure description is clean markdown
      description: postData.jobDescriptions
        ? postData.jobDescriptions.trim()
        : "",
      apply_url: postData.applyUrl || postData.applyEmail,
      x_username: postData.twitterUsername,
      // Add payment details
      payment_id: details.id,
      payment_status: details.status,
    };

    dispatch(createPost(formattedData, navigate));
  };

  if (showPayment) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          my: { xs: 2, sm: 4 },
          mx: "auto",
          height: "100%",
          maxHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: { xs: "20px", sm: "28px" },
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            position: "relative",
            width: "100%",
            maxWidth: "440px",
            mx: "auto",
            overflowY: "auto",
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 10,
                borderRadius: "16px",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/* Logo */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <img
              src="/images/remotenft.png"
              alt="RemoteAI Logo"
              style={{
                height: "32px",
                marginBottom: "8px",
              }}
            />
          </Box>

          {/* Payment Header */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#1a1a1a",
              mb: 2,
            }}
          >
            Complete Payment
          </Typography>

          {/* Job Details Summary */}
          <Box
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: { xs: "16px", sm: "20px" },
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                mb: 1,
                fontWeight: 500,
              }}
            >
              Job Post Summary
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#1a1a1a",
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {postData.position || "Position"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#4a4a4a",
              }}
            >
              at {postData.name || "Company"}
            </Typography>
          </Box>

          {/* Price Display */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: { xs: "12px", sm: "16px" },
              backgroundColor: "#eef2ff",
              borderRadius: "12px",
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#4a4a4a",
                fontWeight: 500,
              }}
            >
              Total Amount
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#312e81",
                fontWeight: 700,
              }}
            >
              $99.00
            </Typography>
          </Box>

          {/* Payment Options */}
          <Box sx={{ mb: 3 }}>
            <PayPalButtons
              fundingSource={FUNDING.PAYPAL}
              createOrder={(data, actions) => {
                setIsLoading(true);
                return actions.order
                  .create({
                    purchase_units: [
                      {
                        amount: {
                          value: "99.00",
                          currency_code: "USD",
                        },
                        description: `Job Post: ${postData.position} at ${postData.name}`,
                      },
                    ],
                  })
                  .finally(() => setIsLoading(false));
              }}
              onApprove={async (data, actions) => {
                setIsLoading(true);
                try {
                  const details = await actions.order.capture();
                  await handlePaymentSuccess(details);
                } catch (error) {
                  console.error("Payment capture failed:", error);
                  alert("Payment failed. Please try again.");
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
                setIsLoading(false);
                alert(
                  "There was an error processing your payment. Please try again."
                );
              }}
              onCancel={() => {
                setIsLoading(false);
              }}
              style={{
                layout: "vertical",
                shape: "pill",
                height: 48,
              }}
            />

            <Box mt={2}>
              <PayPalButtons
                fundingSource={FUNDING.CARD}
                createOrder={(data, actions) => {
                  setIsLoading(true);
                  return actions.order
                    .create({
                      purchase_units: [
                        {
                          amount: {
                            value: "99.00",
                            currency_code: "USD",
                          },
                          description: `Job Post: ${postData.position} at ${postData.name}`,
                        },
                      ],
                    })
                    .finally(() => setIsLoading(false));
                }}
                onApprove={async (data, actions) => {
                  setIsLoading(true);
                  try {
                    const details = await actions.order.capture();
                    await handlePaymentSuccess(details);
                  } catch (error) {
                    console.error("Payment capture failed:", error);
                    alert("Payment failed. Please try again.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                  setIsLoading(false);
                  alert(
                    "There was an error processing your payment. Please try again."
                  );
                }}
                onCancel={() => {
                  setIsLoading(false);
                }}
                style={{
                  layout: "vertical",
                  shape: "pill",
                  height: 48,
                }}
              />
            </Box>
          </Box>

          {/* Back Button */}
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "color 0.2s",
              "&:hover": {
                color: "#312e81",
              },
            }}
            onClick={() => setShowPayment(false)}
          >
            <span style={{ fontSize: "20px" }}>←</span> Back to Edit
          </Typography>

          {/* Secure Payment Notice */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#6b7280",
            }}
          >
            <span style={{ fontSize: "14px" }}>🔒</span>
            <Typography variant="caption">
              Secure payment powered by PayPal
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ marginTop: "30px" }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            display: "flex",
          }}
        >
          <Grid item xs={12}>
            <form noValidate autoComplete="on" onSubmit={handleSubmit}>
              <Form1 postData={postData} setPostData={setPostData} />
              <Form2 postData={postData} setPostData={setPostData} />
            </form>

            <Hidden lgDown>
              <Box
                sx={{
                  height: 250,
                  width: 835,
                }}
              />
              <FormPreview1 postData={postData} />
            </Hidden>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default CreatePost;
