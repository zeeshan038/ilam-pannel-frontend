import { std_management_url } from "@/app/api/constant";
import { baseApi } from "../../app/api/baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addStudent: builder.mutation({
      query: (body) => ({
        url: `${std_management_url}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    checkStudentBySerialNo: builder.query({
      query: (serialNumber) => {
        return {
          url: `${std_management_url}/check-std-by-serial?serialNumber=${serialNumber}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["Student"],
    }),
    findStudentBySerialNo: builder.query({
      query: (serialNumber) => {
        return {
          url: `${std_management_url}/find?serialNumber=${serialNumber}`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["Student"],
    }),
    getAllStudents: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `${std_management_url}/all?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["Student"],
    }),
    getSpecificStudent: builder.query({
      query: (studentId) => {
        return {
          url: `${std_management_url}/student/${studentId}`,
          method: "GET",
        };
      },
      providesTags: ["Student"],
    }),
    updateStudent: builder.mutation({
      query: ({ body, studentId }) => ({
        url: `${std_management_url}/update/${studentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation({
      query: (studentId) => ({
        url: `${std_management_url}/delete/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useAddStudentMutation,
  useCheckStudentBySerialNoQuery,
  useFindStudentBySerialNoQuery,
  useGetSpecificStudentQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation
} = studentApi;
