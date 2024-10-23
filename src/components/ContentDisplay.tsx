import React from 'react'
import { Alert, Skeleton } from 'antd';
import SearchAndViewSwitcher from './SearchAndViewSwitcher';
import Sidebar from './Sidebar';
import { FeedItemPost } from '../types/RSSFeed';

interface ContentDisplayProps {
    categoryLoading: boolean;
    dashboardLoading: boolean;
    categoryError: string | null;
    dashboardError: string | null;
    filteredGroupedPosts: Record<string, FeedItemPost[]>;
    collapsed: boolean;
    setSearchTerm: (term: string) => void;
    handleViewChange: (viewType: string) => void;
    searchTerm: string;
    filteredPosts: FeedItemPost[];
    savedPosts: FeedItemPost[];
    handleSavePost: (post: FeedItemPost) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ categoryLoading, dashboardLoading, categoryError, dashboardError,
    filteredGroupedPosts, collapsed, setSearchTerm, handleViewChange, searchTerm, filteredPosts, savedPosts, handleSavePost, currentPage, setCurrentPage }) => {
    if (categoryLoading || dashboardLoading) {
        return <Skeleton active paragraph={{ rows: 10 }} />;
    }

    if (categoryError || dashboardError) {
        return <Alert message={categoryError || dashboardError} type="error" showIcon />;
    }

    const hasResults = Object.keys(filteredGroupedPosts).length > 0;

    return (
        <>
            <SearchAndViewSwitcher collapsed={collapsed} onSearch={setSearchTerm} onViewChange={handleViewChange} />
            {searchTerm ? (
                hasResults ? (
                    Object.entries(filteredGroupedPosts).map(([, posts]) => (
                        <Sidebar key={posts[0].id} selectedFeedData={posts} onSavePost={handleSavePost}
                            savedPosts={savedPosts} pagination={false} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    ))
                ) : (
                    <p>No se encontraron resultados.</p>
                )
            ) : (
                <Sidebar selectedFeedData={filteredPosts} onSavePost={handleSavePost} savedPosts={savedPosts}
                    currentPage={currentPage} setCurrentPage={setCurrentPage} />
            )}
        </>
    );
}

export default ContentDisplay