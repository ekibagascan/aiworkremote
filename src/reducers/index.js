import { combineReducers } from "@reduxjs/toolkit";

import posts from "./posts";
import categories from "./categories";
import upworkJobs from "./upwork/upworkReducer";

export default combineReducers({
  posts,
  categories,
  upworkJobs,
});
