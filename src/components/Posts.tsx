import React from 'react';
import PostItem from './PostItem';
import { PostsProps } from '@/types/RSSFeed';

const Posts: React.FC<PostsProps> = ({
    selectedFeedData,
    activatedItemIndex,
    onItemSelect,
    onItemActivate,
}) => {
    return (
        <>
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
        </>
    );
};

export default Posts;
