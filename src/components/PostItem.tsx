import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { PostItemProps } from "../types/RSSFeed";

const PostItem: React.FC<PostItemProps> = ({
    item,
    isActive,
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

    return (
        <div
            className={`rss-item ${isActive ? "selected" : ""} ${isActivated ? "activated" : ""}`}
            onClick={handleClick}
        >
            <h4>{item.title}</h4>
            {isActive && (
                <div className="rss-active">
                    <span>{modifyLinks(item.description)}</span>
                </div>
            )}
        </div>
    );
};

export default PostItem;
