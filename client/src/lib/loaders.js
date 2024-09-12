import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";
import { AuthContext } from "../context/AuthContext";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  console.log(res.data);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = await apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const token = localStorage.getItem("token");
  console.log(token);

  const postPromise = await apiRequest("/users/profilePosts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const chatPromise = await apiRequest("/chats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
