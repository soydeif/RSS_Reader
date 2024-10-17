import React, { useState, useEffect } from "react";
import { fetchRssFeedAsText } from "../rssService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { removeFeed } from "../rssSlice";
import { FeedItemPost } from "../types/RSSFeed";
import { FeedList } from "./FeedList";
import Posts from "./Posts";
import PostItem from "./PostItem";

const Sidebar: React.FC = () => {
    const feeds = useSelector((state: RootState) => state.rss.source);
    const dispatch = useDispatch();

    const [selectedFeedData, setSelectedFeedData] = useState<FeedItemPost[] | null>(null);
    const [activeFeedIndex, setActiveFeedIndex] = useState<number | null>(null);
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
    const [activatedItemIndex, setActivatedItemIndex] = useState<number | null>(null);

    const resetActiveFeed = () => {
        setActiveFeedIndex(null);
        setSelectedFeedData(null);
        setActiveItemIndex(null);
        setActivatedItemIndex(null);
    };

    const handleFeedClick = async (url: string, index: number) => {
        if (activeFeedIndex === index) {
            resetActiveFeed();
        } else {
            const data = await fetchRssFeedAsText(url);
            if (data) {
                setSelectedFeedData(data);
                setActiveFeedIndex(index);
                setActiveItemIndex(null);
                setActivatedItemIndex(null);
            }
        }
    };

    const handleItemClick = (index: number) => {
        if (activeItemIndex === index) {
            setActiveItemIndex(null);
            setActivatedItemIndex(null);
        } else {
            setActiveItemIndex(index);
            setActivatedItemIndex(index);
        }
    };

    useEffect(() => {
        if (activeItemIndex === null) {
            setActivatedItemIndex(null);
        }
    }, [activeItemIndex]);

    const handleDeleteFeed = (feedId: string) => {
        dispatch(removeFeed(feedId));
        if (activeFeedIndex !== null && feeds[activeFeedIndex].id === feedId) {
            resetActiveFeed();
        }
    };

    const handleItemActivate = (index: number | null) => {
        setActivatedItemIndex(index);
    };

    return (
        <div className={`sidebar ${activeItemIndex !== null ? 'active' : ''}`}>
            <div className="sidebar-wrapper">
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
                        activatedItemIndex={activatedItemIndex}
                        onItemSelect={handleItemClick}
                        onItemActivate={handleItemActivate}
                    />
                )}
                {activeItemIndex !== null && selectedFeedData && (
                    <div className="post-item-container">
                        <PostItem
                            item={selectedFeedData[activeItemIndex]}
                            isActive={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
