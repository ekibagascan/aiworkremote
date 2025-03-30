import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import "./App.css";
import Header from "./components/Header/Header";
import Home from "./screens/Home";
import CreatePost from "./screens/CreatePost";
import PostJobDone from "./screens/PostJobDone";
import Footer from "./components/Footer/Footer";
import UpworkJobList from "./components/UpworkJobs/UpworkJobList";

const MyContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
}));

const App = () => {
  return (
    <BrowserRouter>
      <MyContainer maxWidth="xl">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/remote-ai" element={<Home />} />
          <Route path="/remote-ai/posts" element={<Home />} />
          <Route path="/remote-ai/posts/search" element={<Home />} />
          <Route path="/remote-ai/posts/create" element={<CreatePost />} />
          <Route path="/remote-ai/categories/:id" element={<Home />} />
          <Route path="/remote-ai/tags/:tag" element={<Home />} />
          <Route
            path="/remote-ai/upwork"
            element={
              <UpworkJobList
                jobs={useSelector((state) => state.upworkJobs.jobs)}
              />
            }
          />
          <Route path="/remote-ai/postjob" element={<CreatePost />} />
          <Route path="/remote-ai/postjob/:id" element={<PostJobDone />} />
        </Routes>
        <Footer />
      </MyContainer>
    </BrowserRouter>
  );
};

export default App;
