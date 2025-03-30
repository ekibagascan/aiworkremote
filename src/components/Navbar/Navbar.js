import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Container, Toolbar, Box, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              to="/remote-ai/upwork"
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: "#6fda44", // Upwork green
                },
              }}
            >
              Upwork Jobs
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
