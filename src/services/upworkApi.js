import axios from "axios";

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

export const fetchUpworkJobs = async (page = 1) => {
  const options = {
    method: "GET",
    url: "https://upwork-jobs-api2.p.rapidapi.com/search",
    params: {
      query: "artificial intelligence",
      page: String(page),
    },
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "upwork-jobs-api2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Upwork jobs:", error);
    throw error;
  }
};
