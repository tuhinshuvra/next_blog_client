"use server";

import { BlogData, blogService } from "@/services/blog.service";
import { updateTag } from "next/cache";

export const getBlogs = async () => {
  return await blogService.getBlogPosts();
};

export const createBlogPost = async (data: BlogData) => {
  const response = await blogService.createBlogPost(data);
  updateTag("blogPosts");

  return response;
};