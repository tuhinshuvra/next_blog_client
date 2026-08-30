import HistoryTable from '@/components/modules/user/history/HistoryTable';
import PaginationControls from '@/components/ui/pagination_controls';
import { blogService } from '@/services/blog.service';
import React from 'react';

const HistoryPage = async ({ searchParams }: { searchParams: Promise<{ page: string }> }) => {

    const { page } = await searchParams;
    const response = await blogService.getBlogPosts({ page: page || "1" });
    const posts = response?.data?.data || [];
    // const meta = response?.data?.meta;

    console.log("Posts : ", posts);
    const pagination = response?.data?.meta || {
        limit: 10,
        page: 1,
        totalData: 0,
        totalPages: 1
    };

    console.log("Pagination : ", pagination);

    return (
        <div className=''>
            <h1 className=' text-2xl font-bold mb-6'>Blog Post History</h1>
            <HistoryTable posts={posts} />
            <PaginationControls meta={pagination} />
        </div>
    );
};

export default HistoryPage;