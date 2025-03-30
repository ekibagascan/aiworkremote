import { fetchUpworkJobs } from "../../services/upworkApi";

export const FETCH_UPWORK_JOBS_START = "FETCH_UPWORK_JOBS_START";
export const FETCH_UPWORK_JOBS_SUCCESS = "FETCH_UPWORK_JOBS_SUCCESS";
export const FETCH_UPWORK_JOBS_ERROR = "FETCH_UPWORK_JOBS_ERROR";

export const getUpworkJobs =
  (page = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: FETCH_UPWORK_JOBS_START });

      const data = await fetchUpworkJobs(page);

      // Transform Upwork data to match your platform's format
      const transformedJobs =
        data.jobs?.map((job) => ({
          id: job.id || `upwork-${Math.random()}`,
          company_name: job.client?.company || "Company on Upwork",
          title: job.title,
          description: job.description,
          salary_range: job.budget || "See on Upwork",
          job_type: "Remote",
          location: "Remote",
          category: "AI & Machine Learning",
          company_logo_url: "/images/remotenft.png", // You'll need to add this image
          apply_url: job.url,
          source: "upwork",
          created_at: job.date_posted || new Date().toISOString(),
        })) || [];

      dispatch({
        type: FETCH_UPWORK_JOBS_SUCCESS,
        payload: transformedJobs,
      });
    } catch (error) {
      console.error("Error in getUpworkJobs:", error);
      dispatch({
        type: FETCH_UPWORK_JOBS_ERROR,
        payload: error.message,
      });
    }
  };
