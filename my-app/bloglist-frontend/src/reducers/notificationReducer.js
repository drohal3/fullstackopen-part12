import { createSlice } from "@reduxjs/toolkit";

export const MessageTypes = {
  Success: "success",
  Error: "error",
  None: "none",
};

const initialState = {
  message: null,
  timeoutId: null,
  type: MessageTypes.None,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // not ideal solution, but for demonstration and practice good enough
    messageChange(state, action) {
      clearTimeout(state.timeoutId);
      if (state.timeoutId) {
        console.log("cancel timeout", state.timeoutId);
        clearTimeout(state.timeoutId);
      }
      return {
        message: action.payload.message,
        timeoutId: action.payload.timeoutId,
      };
    },
    messageReset: () => {
      return initialState;
    },
  },
});

export const { messageChange, messageReset } = notificationSlice.actions;

export const setNotification = (message, type, timeout) => {
  return (dispatch) => {
    const timeoutId = setTimeout(() => {
      dispatch(messageReset());
    }, timeout * 1000);
    dispatch(messageChange({ message, type, timeoutId }));
  };
};
export default notificationSlice.reducer;
