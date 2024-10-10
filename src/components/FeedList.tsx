import { FeedListProps } from "../types/RSSFeed";

export const FeedList: React.FC<FeedListProps> = ({ feeds, activeFeedIndex, onFeedClick, onDeleteFeed }) => {
    return (
        <ul>
            {feeds.map((feed, index) => (
                <li key={feed.id}>
                    <div
                        className={`feed-header ${activeFeedIndex === index ? 'active' : ''}`}
                        onClick={() => onFeedClick(feed.url, index)}
                        style={{ cursor: 'pointer', padding: '0 10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}
                    >
                        <h3>{feed.title}</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteFeed(feed.id);
                            }}
                        >
                            ✖
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};