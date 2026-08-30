import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BlogPost } from '@/types';
import React from 'react';

const HistoryTable = ({ posts }: { posts: BlogPost[] }) => {
    return (
        <div className='border rounded-md'>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>SL</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Tag</TableHead>
                        <TableHead>View</TableHead>
                        <TableHead>Featured</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post: BlogPost, index: number) => (
                        <TableRow key={post.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.content}</TableCell>
                            <TableCell>{post.tags}</TableCell>
                            <TableCell>{post.views}</TableCell>
                            <TableCell>{post.isFeatured}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default HistoryTable;