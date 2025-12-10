import { dashboard_url } from "@/app/api/constant";
import { baseApi } from "../../../app/api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStudentTrend: builder.query({
            query: () => {
                return {
                    url: `${dashboard_url}/student-trend`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),
        getStudentRatio: builder.query({
            query: () => {
                return {
                    url: `${dashboard_url}/student-ratio`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),
        getFeeCollection: builder.query({
            query: () => {
                return {
                    url: `${dashboard_url}/fee-collection`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),
        getAnalytics: builder.query({
            query: () => {
                return {
                    url: `${dashboard_url}/analytics`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),
        getFeeCollectionReport: builder.query({
            query: (year: string) => {
                return {
                    url: `${dashboard_url}/fee-collection-report?year=${year}`,
                    method: "GET",
                };
            },
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetStudentTrendQuery,
    useGetStudentRatioQuery,
    useGetFeeCollectionQuery,
    useGetAnalyticsQuery,
    useGetFeeCollectionReportQuery,
} = dashboardApi;

