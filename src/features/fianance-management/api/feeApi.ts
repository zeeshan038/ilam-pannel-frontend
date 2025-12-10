import { fee_management_url } from "@/app/api/constant";
import { baseApi } from "../../../app/api/baseApi";

const feeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // addStudent: builder.mutation({
    //   query: (body) => ({
    //     url: `${std_management_url}/create`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Student"],
    // }),
    // checkStudentBySerialNo: builder.query({
    //   query: (serialNumber) => {
    //     return {
    //       url: `${std_management_url}/check-std-by-serial?serialNumber=${serialNumber}`,
    //       method: "GET",
    //     };
    //   },
    //   keepUnusedDataFor: 0,
    //   providesTags: ["Student"],
    // }),
    getAnalytics: builder.query({
      query: () => {
        return {
          url: `${fee_management_url}/analytics`,
          method: "GET",
        };
      },
      providesTags: ["Fee"],
    }),
    getAllFees: builder.query({
      query: ({ search, feeType, feeStatus, page, limit }: any) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (feeType) params.append("feeType", feeType);
        if (feeStatus) params.append("paymentStatus", feeStatus);
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());

        return {
          url: `${fee_management_url}/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Fee"],
    }),
    getMonthlyFeesVoucher: builder.query({
      query: ({ month, year, feeType, class: className }: any) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        if (feeType) params.append("feeType", feeType);
        if (className) params.append("class", className);

        return {
          url: `${fee_management_url}/monthly-voucher-all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Fee"],
    }),
    getFee: builder.query({
      query: (id) => {
        return {
          url: `${fee_management_url}/fees/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Fee"],
    }),
    updateFee: builder.mutation({
      query: (body) => {
        return {
          url: `${fee_management_url}/update/${body.id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Fee"],
    }),
    deleteFee: builder.mutation({
      query: (id) => {
        return {
          url: `${fee_management_url}/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Fee"],
    }),
    createFee: builder.mutation({
      query: ({ studentId, body }) => ({
        url: `${fee_management_url}/create-fee-voucher/${studentId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Fee"],
    })
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAllFeesQuery,
  useGetMonthlyFeesVoucherQuery,
  useLazyGetMonthlyFeesVoucherQuery,
  useGetFeeQuery,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
  useCreateFeeMutation
} = feeApi;

