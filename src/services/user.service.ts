import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const session = await res.json();
            // console.log("cookieStore : ", session);
            if (session === null) {
                return {
                    status: 401,
                    data: null,
                    error: { message: "Session not found!" }
                };
            }
            return {
                status: 200,
                data: session,
                error: null
            };

        } catch (error) {
            console.log(error);
            return {
                data: null,
                error:
                {
                    status: 500,
                    message: "Something went wrong",
                    error: error
                }
            };
        }
    },
}