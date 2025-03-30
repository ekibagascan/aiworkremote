import {
  FETCH_UPWORK_JOBS_START,
  FETCH_UPWORK_JOBS_SUCCESS,
  FETCH_UPWORK_JOBS_ERROR,
} from "../../actions/upwork/upworkActions";

const initialState = {
  jobs: [],
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_UPWORK_JOBS_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_UPWORK_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jobs: action.payload,
        error: null,
      };

    case FETCH_UPWORK_JOBS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
