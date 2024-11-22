import React from "react";
import { FeedDisplayProps } from "@/types/RSSFeed";
import { Empty, Tour } from "antd";

import { useDisplayLogic } from "@/hooks/useDisplayLogic";
import DetailView from "./DetailView";
import CompactView from "./CompactView";


const FeedDisplay: React.FC<FeedDisplayProps> = ({
    selectedFeedData,
    savedPosts,
    onSavePost,
    pagination = true,
    currentPage = 1,
    setCurrentPage,
    typeofPresentation,
    setCollapsed
}) => {

    const {
        formatDate,
        modifyLinks,
        selectedPost,
        setSelectedPost,
        imagesLoaded,
        setImagesLoaded,
        error,
        setError,
        isTourOpen,
        tourStep,
        setTourStep,
        viewportType,
        pageSize,
        defaultImage,
        steps,
        handleTourClose,
    } = useDisplayLogic();

    const totalPosts = Array.isArray(selectedFeedData) ? selectedFeedData.length : 0;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalPosts);
    const postsToShow = Array.isArray(selectedFeedData) ? selectedFeedData.slice(startIndex, endIndex) : [];

    const width = {
        listCard: "200px",
        list: "50px",
    };

    if (totalPosts === 0) {
        setError("No hay publicaciones para mostrar.");
        return null;
    }
    if (postsToShow.length === 0) {
        setError("No hay publicaciones para mostrar.");
        return null;
    }

    const computedWidth = width[typeofPresentation] || width.list;


    return (
        <div className="sidebar"
            style={{
                gridTemplateColumns: selectedPost ? "1fr 1fr" : "1fr",
            }}
        >

            {isTourOpen && <Tour
                open={isTourOpen}
                onClose={handleTourClose}
                steps={steps}
                current={tourStep}
                onChange={(current) => setTourStep(current)}
            />}

            {(Array.isArray(selectedFeedData) && selectedFeedData.length > 0)
                || (Array.isArray(savedPosts) && savedPosts.length > 0) ? (
                <>
                    {<CompactView
                        postsToShow={postsToShow}
                        savedPosts={savedPosts}
                        onSavePost={onSavePost}
                        setSelectedPost={setSelectedPost}
                        selectedPost={selectedPost}
                        viewportType={viewportType}
                        computedWidth={computedWidth}
                        formatDate={formatDate}
                        modifyLinks={modifyLinks}
                        defaultImage={defaultImage}
                        pagination={pagination}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPosts={totalPosts}
                        pageSize={pageSize}
                        imagesLoaded={imagesLoaded}
                        setImagesLoaded={setImagesLoaded}
                        error={error}
                        setCollapsed={setCollapsed}
                    />}
                    {viewportType === 'desktop' &&
                        <DetailView
                            selectedPost={selectedPost}
                            setSelectedPost={setSelectedPost}
                            formatDate={formatDate}
                            modifyLinks={modifyLinks}
                            defaultImage={defaultImage}
                            setImagesLoaded={setImagesLoaded}
                        />}
                </>
            ) : (
                <Empty description="No results found" />
            )}


        </div>
    );
};

export default FeedDisplay;