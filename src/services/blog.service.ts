import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface ServiceOptions {
    cache?: RequestCache;
    revalidate?: number;
}

interface GetBlogsParams {
    isFeatured?: boolean;
    search?: string;
    page?: string;
    limit?: string;
}

export interface BlogData {
    title: string;
    content: string;
    tags: string[];
}

export const blogService = {
    getBlogPosts: async function (
        params?: GetBlogsParams,
        options?: ServiceOptions
    ) {
        try {
            const url = new URL(`${API_URL}/posts`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        url.searchParams.append(key, value);
                    }
                })
            }

            const config: RequestInit = {};

            if (options?.cache) {
                config.cache = options.cache;
            }
            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["blogPosts"] };
            const response = await fetch(url.toString(), config);

            // const response = await fetch(url.toString(), {
            //     next: { tags: ['blogPosts'] }
            // });

            const data = await response.json();
            // console.log("Post data: ", data);

            return { data: data, error: null };

        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    getBlogById: async function (id: string) {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`);
            const data = await response.json();

            return { data: data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    createBlogPost: async function (blogData: BlogData) {
        const cookieStore = await cookies();
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(blogData),
            });
            const data = await response.json();

            if (data.error) {
                return { message: data.error || "Error Post not created" };
            }

            return { data: data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    }
}