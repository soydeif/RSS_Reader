/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Image, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface DetailViewProps {
    selectedPost: any;
    formatDate: (date: string) => string;
    modifyLinks: (text: string) => React.ReactNode | string;
    defaultImage: string;
    setSelectedPost: (post: null) => void;
    setImagesLoaded: (loaded: boolean) => void;
}

const DetailView: React.FC<DetailViewProps> = ({
    selectedPost,
    formatDate,
    modifyLinks,
    defaultImage,
    setSelectedPost,
    setImagesLoaded,
}) => {
    if (!selectedPost) return null;

    return (
        <div className="detail-view">
            <div className="headline">
                <a href={selectedPost?.link} target="_blank" rel="noopener noreferrer">
                    <h4 className="detail-title">{modifyLinks(selectedPost.title)}</h4>
                </a>
                <Button
                    className="close-button"
                    icon={<CloseOutlined />}
                    onClick={() => setSelectedPost(null)}
                />
            </div>

            <Image
                alt={selectedPost?.title}
                src={selectedPost?.thumbnailurl || selectedPost?.imagesource || "error"}
                fallback={defaultImage}
                loading="lazy"
                className="detail-image"
                onLoad={() => setImagesLoaded(true)}
                onError={() => setImagesLoaded(false)}
            />

            <div className="post-meta">
                <span className="author">{modifyLinks(selectedPost.author)}</span>
                <time>{formatDate(selectedPost.publishedat)}</time>
            </div>

            <p className="post-description">
                {selectedPost?.content ? modifyLinks(selectedPost.content) : "No content available."}
            </p>
            <a
                href={selectedPost?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="continue-reading"
            >
                Continue reading...
            </a>
        </div>
    );
};

export default DetailView;
