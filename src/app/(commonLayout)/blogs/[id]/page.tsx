import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, CornerDownRight, Eye, Calendar, Clock } from "lucide-react";
import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types";

type BlogComment = {
  id: string;
  authorId?: string | null;
  content: string;
  createdAt: string | Date;
  replies?: BlogComment[];
};

export async function generateStaticParams() {
  const { data } = await blogService.getBlogPosts();
  return data?.data?.map((blog: BlogPost) => ({ id: blog.id })).splice(0, 3);
}

// Recursive Comment Renderer
function CommentItem({ comment, isReply = false }: { comment: BlogComment; isReply?: boolean }) {
  return (
    <div className={`space-y-3 ${isReply ? "ml-6 mt-3 border-l-2 pl-4 border-muted" : "mt-4"}`}>
      <div className="flex items-start gap-3">
        {isReply && <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {comment.authorId?.slice(0, 2).toUpperCase() ?? "US"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              User: {comment.authorId?.slice(0, 8)}...
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
        </div>
      </div>

      {/* Render recursive replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: blog } = await blogService.getBlogById(id);

  if (!blog || !blog.id) {
    notFound();
  }

  const contentText = blog.content ?? "";
  const wordCount = contentText ? contentText.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <article className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <header className="mb-8 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{blog.views ?? 0} views</span>
          </div>
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-foreground">
        <p className="whitespace-pre-wrap text-lg leading-8">{blog.content}</p>
      </div>

      <Separator className="my-8" />

      {/* Tags & Meta Details */}
      <footer className="space-y-6 mb-10">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-sm font-normal rounded-full"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{blog._count?.comments ?? 0} comments</span>
          {blog.isFeatured && (
            <Badge variant="outline" className="rounded-full">
              Featured
            </Badge>
          )}
        </div>
      </footer>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({blog._count?.comments ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment: BlogComment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}