import { create } from "zustand";
import apiRequest from "./apiRequest.js";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest.get("/users/notification", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    set({ number: res.data });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
