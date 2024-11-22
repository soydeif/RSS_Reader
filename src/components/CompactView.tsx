/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import { Pagination, Alert, Image } from "antd";
import Icon from "./icons/icons";

interface CompactViewProps {
    postsToShow: any[];
    savedPosts: any[];
    onSavePost: (post: any) => void;
    setSelectedPost: (post: any) => void;
    selectedPost: any;
    viewportType: string;
    computedWidth: string;
    formatDate: (date: string) => string;
    modifyLinks: (text: string) => React.ReactNode | string;
    defaultImage: string;
    pagination?: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPosts: number;
    pageSize: number;
    imagesLoaded: boolean;
    setImagesLoaded: (loaded: boolean) => void;
    error: string | null;
    setCollapsed: (collapsed: boolean) => void;
}



const CompactView: React.FC<CompactViewProps> = ({
    postsToShow,
    savedPosts,
    onSavePost,
    setSelectedPost,
    selectedPost,
    viewportType,
    computedWidth,
    formatDate,
    modifyLinks,
    defaultImage,
    pagination = true,
    currentPage,
    setCurrentPage,
    totalPosts,
    pageSize,
    imagesLoaded,
    setImagesLoaded,
    error,
    setCollapsed,
}) => {
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
                            onClick={() => {
                                if (viewportType === "desktop") {
                                    setSelectedPost(selectedPost?.id === post.id ? null : post);
                                    setCollapsed(true);
                                }
                            }}
                        >
                            {viewportType !== "list" && (
                                <Image
                                    alt={post?.title}
                                    src={post?.thumbnailurl || post?.imagesource || "error"}
                                    fallback={defaultImage}
                                    loading="lazy"
                                    className={`thumbnail ${viewportType !== "desktop" ? "full-width" : ""
                                        }`}
                                    style={{
                                        width: viewportType !== "desktop" ? "100%" : computedWidth,
                                        height: "auto",
                                        objectPosition: "center",
                                        aspectRatio: viewportType !== "desktop" ? "2/1" : "16/9",
                                    }}
                                    onLoad={() => setImagesLoaded(true)}
                                    onError={() => setImagesLoaded(false)}
                                />
                            )}
                            <div className="post-details">
                                <span className="author">{modifyLinks(post.author)}</span>
                                <time className="published-time">
                                    {formatDate(post.publishedat)}
                                </time>
                                <h4 className="post-headline">{modifyLinks(post.title)}</h4>
                            </div>
                            <div
                                className="save-icon"
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

            {error && <Alert message={error} type="error" showIcon />}

            {pagination && totalPosts > pageSize && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalPosts}
                        onChange={(page) => {
                            setCurrentPage(page);
                            if (imagesLoaded) {
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }
                        }}
                        hideOnSinglePage
                    />
                </div>
            )}
        </div>
    );
};

export default CompactView;
