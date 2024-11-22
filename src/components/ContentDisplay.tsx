import React from "react";
import { Alert, Skeleton, Empty } from "antd";
import FeedDisplay from "./FeedDisplay";
import { ContentDisplayProps } from "@/types/RSSFeed";

const ContentDisplay: React.FC<ContentDisplayProps> = ({
    savedPosts,
    handleSavePost,
    currentPage,
    setCurrentPage,
    typeofPresentation,
    feed,
    error,
    loading,
    setCollapsed
}) => {
    if (loading) {
        return <Skeleton active paragraph={{ rows: 10 }} />;
    }
    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <>
            {feed.length > 0 ? (
                <FeedDisplay
                    selectedFeedData={feed}
                    onSavePost={handleSavePost}
                    savedPosts={savedPosts}
                    pagination={true}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    typeofPresentation={typeofPresentation}
                    setCollapsed={setCollapsed}
                />
            ) : (
                <Empty description="No results found" />
            )}
        </>
    );
};

export default ContentDisplay;
