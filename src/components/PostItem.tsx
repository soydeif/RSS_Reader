import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { PostItemProps } from "@/types/RSSFeed";

const PostItem: React.FC<PostItemProps> = ({
    item,
    isActivated,
    onItemClick = () => { },
    onItemActivate = () => { },
}) => {

    const modifyLinks = (html: string) => {
        const sanitizedHTML = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
        });
        return parse(sanitizedHTML, {
            replace: (domNode) => {
                if (domNode.type === "tag" && domNode.name === "a") {
                    domNode.attribs.target = "_blank";
                    domNode.attribs.rel = "noopener noreferrer";
                }
            },
        });
    };

    const handleClick = () => {
        onItemClick();
        onItemActivate();
    };


    const renderVideo = (videoId: string) => {
        if (videoId) {
            return (
                <div className="video-container">
                    <iframe
                        width="400"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Video"
                        allowFullScreen
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`rss-item ${isActivated ? "activated" : ""}`} onClick={handleClick}>
            <h4>{item.title}</h4>
            {isActivated && (
                <div className="rss-active">
                    <span>{modifyLinks(item.description)}</span>
                    {item.videoId && renderVideo(item.videoId)}
                </div>
            )}
        </div>
    );
};

export default PostItem;

