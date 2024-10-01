import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { authSlice } from "../../auth";
import { classSlice } from "../../class";
import { courseSlice } from "../../course";
import { lessonSlice } from "../../lesson";
import { studentSlice } from "../../student";
import { chatSlice } from "../../chat";
import { exerciseSlice } from "../../exercise";
import themeReducer from "./themeSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  [authSlice.name]: authSlice.reducer,
  [classSlice.name]: classSlice.reducer,
  [courseSlice.name]: courseSlice.reducer,
  [lessonSlice.name]: lessonSlice.reducer,
  [studentSlice.name]: studentSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
  [exerciseSlice.name]: exerciseSlice.reducer,
});

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({ serializableCheck: false }).prepend(
      listenerMiddlewareInstance.middleware
    ),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
