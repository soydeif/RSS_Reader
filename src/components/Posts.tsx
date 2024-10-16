import { PostsProps } from "../types/RSSFeed";
import PostItem from "./PostItem";

const Posts: React.FC<PostsProps> = ({
    selectedFeedData,
    onItemSelect

}) => {
    if (!selectedFeedData) return null;

    return (
        <div className="posts-container">
            {selectedFeedData.map((item, idx) => (
                <PostItem
                    key={idx}
                    item={item}
                    onItemClick={() => onItemSelect(idx)}
                />
            ))}
        </div>
    );
};

export default Posts;
