import React, { Fragment } from "react";
import { SidebarProps } from "@/types/RSSFeed";
import { Pagination, Alert, Button, Image, Empty, Tour } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Icon from "./icons/icons";
import { useSidebarLogic } from "@/hooks/useSidebarLogic";


const Sidebar: React.FC<SidebarProps> = ({
    selectedFeedData,
    savedPosts,
    onSavePost,
    pagination = true,
    currentPage = 1,
    setCurrentPage,
    typeofPresentation,
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
        handleTourClose
    } = useSidebarLogic();

    const totalPosts = selectedFeedData.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalPosts);
    const postsToShow = selectedFeedData.slice(startIndex, endIndex);

    const width = {
        listCard: "200px",
        list: "50px",
    };

    const dynamicPosition =
        viewportType === "desktop"
            ? !selectedPost || totalPosts > 5
                ? "absolute"
                : "unset"
            : "unset";


    if (totalPosts === 0) {
        setError("No hay publicaciones para mostrar.");
        return null;
    }
    if (postsToShow.length === 0) {
        setError("No hay publicaciones para mostrar.");
        return null;
    }

    const computedWidth = width[typeofPresentation] || width.list;
    const renderCompactView = () => {

        return (
            <div className="compact-view">
                {postsToShow?.map((post, index) => {
                    const isSaved = savedPosts.some(
                        (savedPost) => savedPost.id === post.id
                    );
                    return (
                        <Fragment key={index}>
                            <div
                                className="rss-item"
                                onClick={() =>
                                    viewportType !== 'desktop' ? null :
                                        setSelectedPost(selectedPost?.id === post.id ? null : post)
                                }
                            >
                                {typeofPresentation !== 'list' && (
                                    <Image
                                        alt={post?.title}
                                        src={post?.thumbnailUrl || "error"}
                                        fallback={defaultImage}
                                        loading="lazy"
                                        className={`thumbnail ${viewportType !== 'desktop' ? "full-width" : ""}`}
                                        style={{
                                            width: viewportType !== 'desktop' ? '100%' : computedWidth,
                                            height: "auto",
                                            objectPosition: "center",
                                            aspectRatio: viewportType !== 'desktop' ? '2/1' : '16/9',
                                        }}
                                        onLoad={() => { setImagesLoaded(true); }}
                                        onError={() => { setImagesLoaded(false); }}
                                    />
                                )}
                                <div className="post-details">
                                    {post && (
                                        <span className="author">
                                            {modifyLinks(post.author || "Unknown")}
                                        </span>
                                    )}
                                    {post?.publishedAt && (
                                        <time className="published-time">
                                            {formatDate(post.publishedAt)}
                                        </time>
                                    )}

                                    <h4 className="post-headline">
                                        {modifyLinks(post.title)}
                                    </h4>

                                    {viewportType !== 'desktop' &&
                                        (<>
                                            <p className="post-description">
                                                {modifyLinks(post.description)}
                                            </p>
                                            <a href={post.link} target="_blank" rel="noopener noreferrer" className="continue-reading">
                                                Continue reading...
                                            </a>
                                        </>)}
                                </div>
                                <div
                                    className={`save-icon ${viewportType !== 'desktop' ? "self-end" : "self-start"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSavePost(post);
                                    }}
                                >
                                    {isSaved ? <Icon name="save" /> : <Icon name="saved" />}
                                </div>
                            </div>
                        </Fragment>
                    );
                })}

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        className="error-alert"
                    />
                )}

                {pagination && totalPosts > 5 && (
                    <div className="pagination-container"
                        style={{
                            position: dynamicPosition
                        }}>
                        {pageSize < 10 && (
                            <Button
                                className="pagination-button"
                                title="Initial page"
                                onClick={() => { setCurrentPage(1); }}
                                disabled={currentPage === 1}
                            >
                                <Icon name="firstPage" />
                            </Button>
                        )}

                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalPosts}
                            onChange={(page) => {
                                setCurrentPage(page);
                                if (imagesLoaded || typeofPresentation !== 'listCard') {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className="pagination"
                            hideOnSinglePage={true}
                            showSizeChanger={false}
                            showLessItems
                        />

                        {pageSize < 10 && (
                            <Button
                                className="pagination-button"
                                title="Last page"
                                onClick={() => setCurrentPage(Math.ceil(totalPosts / pageSize))}
                                disabled={currentPage === Math.ceil(totalPosts / pageSize)}
                            >
                                <Icon name="lastPage" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderDetailView = () => {
        if (!selectedPost) return null;

        return (
            <div className="detail-view">
                <div className="headline">
                    <a href={selectedPost?.link} target="_blank" rel="noopener noreferrer">
                        <h4 className="detail-title">
                            {modifyLinks(selectedPost.title)}
                        </h4>
                    </a>
                    <Button className="close-button" color="default" variant="text" onClick={() => setSelectedPost(null)} icon={<CloseOutlined />} />
                </div>

                <Image
                    alt={selectedPost?.title}
                    src={selectedPost?.thumbnailUrl || "error"}
                    fallback={defaultImage}
                    loading="lazy"
                    className="detail-image"
                    onLoad={() => { setImagesLoaded(true); }}
                    onError={() => { setImagesLoaded(false); }}
                />

                <div className="post-meta">
                    {selectedPost?.author && (
                        <span className="author">
                            {modifyLinks(selectedPost.author)}
                        </span>
                    )}
                    {selectedPost?.publishedAt && (
                        <time>{formatDate(selectedPost.publishedAt)}</time>
                    )}
                </div>

                <p className="post-description">
                    {modifyLinks(selectedPost.description)}
                </p>
                {selectedPost?.link && (
                    <a href={selectedPost.link} target="_blank" rel="noopener noreferrer" className="continue-reading">
                        Continue reading...
                    </a>
                )}
            </div>
        );
    };

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

            {(selectedFeedData.length > 0 || savedPosts.length > 0) ? (
                <>
                    {renderCompactView()}
                    {viewportType === 'desktop' && renderDetailView()}
                </>
            ) :
                <Empty description="No results founded" />
            }

        </div>
    );
};

export default Sidebar;