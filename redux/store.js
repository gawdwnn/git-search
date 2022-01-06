import { configureStore } from "@reduxjs/toolkit";
import { searchReducer } from "./reducer";

export const store = configureStore({
  reducer: {
    searchResult: searchReducer,
  },
});
