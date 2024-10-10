import React, { useState } from 'react';
import { fetchRssFeedAsText } from '../rssService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFeed } from '../rssSlice';
import { Posts } from './Posts';
import { FeedItemPost } from '../types/RSSFeed';
import { FeedList } from './FeedList';



const Sidebar: React.FC = () => {
    const feeds = useSelector((state: RootState) => state.rss.source);
    const dispatch = useDispatch();

    const [selectedFeedData, setSelectedFeedData] = useState<FeedItemPost[] | null>(null);
    const [activeFeedIndex, setActiveFeedIndex] = useState<number | null>(null);
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

    const handleFeedClick = async (url: string, index: number) => {
        if (activeFeedIndex === index) {
            resetActiveFeed();
        } else {
            const data = await fetchRssFeedAsText(url);
            if (data) {
                setSelectedFeedData(data);
                setActiveFeedIndex(index);
                setActiveItemIndex(null);
            }
        }
    };

    const resetActiveFeed = () => {
        setActiveFeedIndex(null);
        setSelectedFeedData(null);
    };

    const handleItemClick = (index: number) => {
        setActiveItemIndex(activeItemIndex === index ? null : index);
    };

    const handleDeleteFeed = (feedId: string) => {
        dispatch(removeFeed(feedId));
        if (activeFeedIndex !== null && feeds[activeFeedIndex].id === feedId) {
            resetActiveFeed();
        }
    };

    return (
        <div className='sidebar'>
            <h2>Feeds RSS</h2>
            <div className='sidebar-wrapper'>
                <FeedList
                    feeds={feeds}
                    activeFeedIndex={activeFeedIndex}
                    onFeedClick={handleFeedClick}
                    onDeleteFeed={handleDeleteFeed}
                />
                {activeFeedIndex !== null && selectedFeedData && (
                    <Posts
                        selectedFeedData={selectedFeedData}
                        activeItemIndex={activeItemIndex}
                        handleItemClick={handleItemClick}
                    />
                )}
            </div>
        </div>
    );
};



export default Sidebar;
