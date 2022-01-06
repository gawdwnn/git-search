import { createReducer } from "@reduxjs/toolkit";
import { search } from "./actions";

const initialState = {
  data: null,
  pending: false,
  error: false,
};

export const searchReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(search.pending, (state) => {
      state.pending = true;
    })
    .addCase(search.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.data = payload;
    })
    .addCase(search.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
});
