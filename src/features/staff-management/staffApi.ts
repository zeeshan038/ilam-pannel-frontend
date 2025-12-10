import { staff_management_url} from "@/app/api/constant";
import { baseApi } from "../../app/api/baseApi";

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStaff: builder.mutation({
      query: (body) => ({
        url: `${staff_management_url}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    getAllStaff: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `${staff_management_url}/all?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["Staff"],
    }),
    updateStaff: builder.mutation({
      query: ({ body, staffId }) => ({
        url: `${ staff_management_url}/update/${staffId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    deletestaff: builder.mutation({
      query: (staffId) => ({
        url: `${ staff_management_url}/delete/${staffId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
    useGetAllStaffQuery,
    useDeletestaffMutation,
    useUpdateStaffMutation,
    useCreateStaffMutation,
} = staffApi;