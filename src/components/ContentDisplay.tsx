import React from 'react'
import { Alert, Skeleton, Empty } from 'antd';
import NavControls from './NavControls';
import Sidebar from './Sidebar';
import { ContentDisplayProps } from '@/types/RSSFeed';



const ContentDisplay: React.FC<ContentDisplayProps> = ({ categoryLoading, dashboardLoading, categoryError, dashboardError,
    filteredGroupedPosts, collapsed, setSearchTerm, searchTerm, filteredPosts, savedPosts, handleSavePost,
    currentPage, setCurrentPage, setTypeofPresentation, typeofPresentation }) => {

    if (categoryLoading || dashboardLoading) {
        return <Skeleton active paragraph={{ rows: 10 }} />;
    }

    if (categoryError || dashboardError) {
        return <Alert message={categoryError || dashboardError} type="error" showIcon />;
    }

    const hasResults = Object.keys(filteredGroupedPosts).length > 0;

    return (
        <>
            <NavControls collapsed={collapsed} onSearch={setSearchTerm} setTypeofPresentation={setTypeofPresentation} />
            {searchTerm ? (
                hasResults ? (
                    Object.entries(filteredGroupedPosts).map(([, posts]) => (
                        <Sidebar key={posts[0].id} selectedFeedData={posts} onSavePost={handleSavePost}
                            savedPosts={savedPosts} pagination={false} currentPage={currentPage} setCurrentPage={setCurrentPage}
                            typeofPresentation={typeofPresentation} />
                    ))
                ) : (
                    <Empty description="No results founded" />
                )
            ) : (
                <Sidebar selectedFeedData={filteredPosts} onSavePost={handleSavePost} savedPosts={savedPosts}
                    currentPage={currentPage} setCurrentPage={setCurrentPage} typeofPresentation={typeofPresentation} />
            )}
        </>
    );
}

export default ContentDisplay