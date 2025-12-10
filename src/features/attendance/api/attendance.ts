import { attendance_url } from "../../../app/api/constant";
import { baseApi } from "../../../app/api/baseApi";


const attendanceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        attendance: builder.mutation({
            query: ({ empId, body }) => ({
                url: `${attendance_url}/create/${empId}`,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["Attendance"],
        }),
        getAttendanceByDate: builder.query({
            query: (date: string) => ({
                url: `${attendance_url}/report?date=${date}`,
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),
    }),
});

export const {
    useAttendanceMutation,
    useGetAttendanceByDateQuery,
} = attendanceApi;