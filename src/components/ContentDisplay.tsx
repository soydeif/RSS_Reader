import React, { Dispatch, SetStateAction } from 'react'
import { Alert, Skeleton } from 'antd';
import NavControls from './NavControls';
import Sidebar from './Sidebar';
import { FeedItemPost } from '../types/RSSFeed';

type PresentationType = 'listCard' | 'list';

interface ContentDisplayProps {
    categoryLoading: boolean;
    dashboardLoading: boolean;
    categoryError: string | null;
    dashboardError: string | null;
    filteredGroupedPosts: Record<string, FeedItemPost[]>;
    collapsed: boolean;
    setSearchTerm: (term: string) => void;
    searchTerm: string;
    filteredPosts: FeedItemPost[];
    savedPosts: FeedItemPost[];
    handleSavePost: (post: FeedItemPost) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    typeofPresentation: PresentationType;
    setTypeofPresentation: Dispatch<SetStateAction<PresentationType>>;
}

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
                    <p>No se encontraron resultados.</p>
                )
            ) : (
                <Sidebar selectedFeedData={filteredPosts} onSavePost={handleSavePost} savedPosts={savedPosts}
                    currentPage={currentPage} setCurrentPage={setCurrentPage} typeofPresentation={typeofPresentation} />
            )}
        </>
    );
}

export default ContentDisplay