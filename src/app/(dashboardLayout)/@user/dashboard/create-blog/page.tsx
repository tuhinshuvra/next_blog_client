import CreateBlogFormClient from "@/components/modules/user/createBlog/CreateBlogFormClient";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types";

const CreateBlogPage = async () => {
    const { data } = await blogService.getBlogPosts();
    return (
        <div>
            <CreateBlogFormClient />
            {data?.data?.map((item: BlogPost) => (
                <div key={item.id}>
                    <h1>{item.title}</h1>
                    {/* <p>{item.content}</p> */}
                </div>
            ))}
        </div>
    );
};

export default CreateBlogPage;