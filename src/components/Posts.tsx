import React from "react";
import { PostsProps } from "../types/RSSFeed";
import PostItem from "./PostItem";

const Posts: React.FC<PostsProps> = ({
    selectedFeedData,
    activatedItemIndex,
    onItemSelect,
    onItemActivate,
}) => {
    if (!selectedFeedData) return null;

    return (
        <div className="posts-container">
            {selectedFeedData.map((item, idx) => (
                <PostItem
                    key={idx}
                    item={item}
                    isActivated={idx === activatedItemIndex}
                    onItemClick={() => onItemSelect(idx)}
                    onItemActivate={() => {
                        if (activatedItemIndex === idx) {
                            onItemActivate(null);
                        } else {
                            onItemActivate(idx);
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default Posts;
