import {
  FETCH_POSTS,
  FETCH_POST,
  CREATE_POST,
  DELETE,
  UPDATE,
  FETCH_BY_CATEGORY,
  FETCH_BY_TAG,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  LIKE,
  FETCH_BY_CREATOR,
  START_LOADING,
  END_LOADING,
  FETCH_UPWORK_JOBS,
} from "../constants/actionTypes";

const initialState = {
  isLoading: true,
  posts: [],
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, isLoading: true };
    case "END_LOADING":
      return { ...state, isLoading: false };
    case FETCH_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case FETCH_POST:
      return {
        ...state,
        post: action.payload,
        isLoading: false,
      };
    case FETCH_BY_TAG:
      return {
        ...state,
        posts: action.payload || [],
        isLoading: false,
        activeTag: action.tag,
      };
    case FETCH_BY_CATEGORY:
      return {
        ...state,
        posts: action.payload || [],
        isLoading: false,
        activeTag: null,
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload],
        isLoading: false,
      };
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        isLoading: false,
      };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        isLoading: false,
      };
    case "FETCH_ALL":
      return action.payload;
    case "SET_FILTERED_POSTS":
      return action.payload;
    case FETCH_UPWORK_JOBS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
      };
    default:
      return state;
  }
};

export default posts;
