import React from "react";
import { Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const PostJob = styled(Fab)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "#0F00FF",
  borderRadius: "5px",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(90deg, #92fe9d 0%, #00C9FF 100%)",
  },
  [theme.breakpoints.down("sm")]: {
    top: theme.spacing(2.3),
    width: "50px",
    height: "25px",
    fontSize: "0.4rem",
    fontWeight: 400,
    borderRadius: "3px",
  },
}));

const FloatingButton = () => {
  return (
    <div>
      <Link to="/remote-ai/postjob">
        <PostJob variant="extended" aria-label="postjob" size="small">
          Post Job
        </PostJob>
      </Link>
    </div>
  );
};

export default FloatingButton;
