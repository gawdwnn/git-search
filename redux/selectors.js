import { createSelector } from "@reduxjs/toolkit";

export const selectSearch = (state) => state.searchResult;

export const searchSelector = createSelector(selectSearch, (state) => state);
