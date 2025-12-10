import { salary_management_url } from "@/app/api/constant";
import { baseApi } from "../../../app/api/baseApi";

const SalaryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSalary: builder.mutation({
            query: ({ id, body }) => ({
                url: `${salary_management_url}/create/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Salary"],
        }),
        genrateSalaries: builder.mutation({
            query: (body) => ({
                url: `${salary_management_url}/monthly`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Salary"],
        }),
        getAllSalaries: builder.query({
            query: ({ search = "", month = "", year = "", paymentMode = "", status = "", role = "", page = 1, limit = 10 } = {}) => ({
                url: `${salary_management_url}/all`,
                method: "GET",
                params: { search, month, year, paymentMode, status, role, page, limit },
            }),
            providesTags: ["Salary"],
        }),
        paySalary: builder.mutation({
            query: ({ id, body }) => ({
                url: `${salary_management_url}/pay/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Salary"],
        }),
        getAnalytics: builder.query({
            query: () => ({
                url: `${salary_management_url}/analytics`,
                method: "GET",
            }),
            providesTags: ["Salary"],
        }),
        updateSalary: builder.mutation({
            query: ({ id, body }) => ({
                url: `${salary_management_url}/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Salary"],
        }),
        deleteSalary: builder.mutation({
            query: (id) => ({
                url: `${salary_management_url}/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Salary"],
        }),
    }),
});

export const {
    useCreateSalaryMutation,
    useGenrateSalariesMutation,
    useGetAllSalariesQuery,
    useGetAnalyticsQuery,
    usePaySalaryMutation,
    useUpdateSalaryMutation,
    useDeleteSalaryMutation,
} = SalaryApi;
