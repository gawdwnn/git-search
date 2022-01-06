import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const authToken = "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";

export const search = createAsyncThunk("search", async (query) => {
  const response = await axios.get(`https://api.github.com/search/users?q=${query}`, {
    headers: {
      Authorization: `token ${authToken}`,
    },
  });

  return response.data;
});
