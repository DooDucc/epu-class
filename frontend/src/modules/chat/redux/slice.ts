/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { COMPONENT_STAGES } from "../../base/utils";
import { ChatState, ChatType } from "../types";

const initialState: ChatState = {
  chat: {
    data: [],
    currentChat: null,
    state: COMPONENT_STAGES.LOADING,
    currentPage: 1,
    totalPages: 0,
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (
      state,
      action: PayloadAction<{
        data?: ChatType[];
        currentChat?: ChatType | null;
        state?: string;
        currentPage?: number;
        totalPages?: number;
      }>
    ) => {
      state.chat = {
        ...state.chat,
        ...action.payload,
      };
    },
  },
});

export const { setChats } = chatSlice.actions;

export default chatSlice.reducer;
