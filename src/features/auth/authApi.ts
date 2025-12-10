import { user_url } from "../../app/api/constant";
import { baseApi } from "../../app/api/baseApi";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    id: string;
    email: string;
    name: string;
    role: string;
    instituteName: string;
    token: string;
    msg: string;
    status: boolean;
}

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: `${user_url}/login`,
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
} = authApi;