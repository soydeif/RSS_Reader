import { PostsProps } from '../types/RSSFeed';
import { PostItem } from './PostItem';

export const Posts: React.FC<PostsProps> = ({ selectedFeedData, activeItemIndex, handleItemClick }) => {
    if (!selectedFeedData) return null;

    return (
        <div className="posts-container">
            {selectedFeedData.map((item, idx) => (
                <PostItem
                    key={idx}
                    item={item}
                    isActive={activeItemIndex === idx}
                    onItemClick={() => handleItemClick(idx)}
                />
            ))}
        </div>
    );
};
