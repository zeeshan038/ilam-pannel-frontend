import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    const publicEndpoints = ['login'];
    if (!publicEndpoints.includes(endpoint)) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log("token", token)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "Student", "Staff", "Fee", "Expense", "Dashboard", "Attendance"],
});