import { expense_management_url } from "@/app/api/constant";
import { baseApi } from "../../../app/api/baseApi";

const ExpenseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createExpense: builder.mutation({
            query: (body) => ({
                url: `${expense_management_url}/create`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Expense"],
        }),
        getAllExpenses: builder.query({
            query: ({ search = "", date = "", oldest = "", page = 1, limit = 10 }) => ({
                url: `${expense_management_url}/all`,
                method: "GET",
                params: { search, date, oldest, page, limit },
            }),
            providesTags: ["Expense"],
        }),
        getExpense: builder.query({
            query: (id) => ({
                url: `${expense_management_url}/expense/${id}`,
                method: "GET",
            }),
            providesTags: ["Expense"],
        }),
        getExpenseSummary: builder.query({
            query: () => ({
                url: `${expense_management_url}/summary`,
                method: "GET",
            }),
            providesTags: ["Expense"],
        }),
        updateExpense: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${expense_management_url}/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Expense"],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `${expense_management_url}/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Expense"],
        }),
    }),
});

export const {
    useCreateExpenseMutation,
    useGetAllExpensesQuery,
    useGetExpenseQuery,
    useGetExpenseSummaryQuery,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = ExpenseApi;



