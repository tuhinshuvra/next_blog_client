"use client";

import { createBlogPost } from '@/actions/blog.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod';

const blogSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be at most 200 characters"),
    content: z.string()
        .min(3, "Content must be at least 3 characters")
        .max(5000, "Content must be at most 5000 characters"),
    tags: z.string().min(3, "Tags must be at least 3 characters"),
})

const CreateBlogFormClient = () => {
    const form = useForm({
        defaultValues: {
            title: "",
            content: "",
            tags: "",
        },
        validators: {
            onSubmit: blogSchema
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating blog...");

            const blogData = {
                ...value,
                tags: value.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ""),
            }
            // console.log("BlogData...", blogData);

            try {
                const res = await createBlogPost(blogData);
                // console.log("res...", res);
                toast.success("Blog created successfully", { id: toastId });
                form.reset();
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong, please try again", { id: toastId });
            }
        }
    })

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create Blog</CardTitle>
                <CardDescription>Write your blog content here</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id='blog-post'
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="title"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Enter Blog Title"
                                        />
                                        {isInvalid && (<FieldError errors={field.state.meta.errors} />)}
                                    </Field>
                                );
                            }}
                        />
                        <form.Field
                            name="content"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Enter Blog Content here"
                                        />
                                        {isInvalid && (<FieldError errors={field.state.meta.errors} />)}
                                    </Field>
                                );
                            }}
                        />
                        <form.Field
                            name="tags"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Tags (coma separated)</FieldLabel>
                                        <Input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="nextjs, web, postgresql, typescript"
                                        />
                                        {isInvalid && (<FieldError errors={field.state.meta.errors} />)}
                                    </Field>
                                );
                            }}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    form='blog-post'
                    type="submit"
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CreateBlogFormClient;