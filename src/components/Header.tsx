import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFeed } from "../rssSlice";
import { fetchRssFeedAsText } from "../rssService";
import { v4 as uuidv4 } from "uuid";

const Header: React.FC = () => {
    const [feedUrl, setFeedUrl] = useState("");
    const dispatch = useDispatch();

    const handleAddFeed = async (e: React.FormEvent) => {
        e.preventDefault();

        if (feedUrl) {
            const feedData = await fetchRssFeedAsText(feedUrl);

            if (feedData && feedData.length > 0) {
                const newFeed = {
                    id: uuidv4(),
                    title: feedData[0].feedTitle,
                    url: feedUrl,
                };
                dispatch(addFeed(newFeed));
                setFeedUrl("");
            } else {
                console.error("No se pudo obtener el título del feed.");
            }
        }
    };

    return (
        <div className="header">
            <h2>Feeds RSS</h2>

            <form onSubmit={handleAddFeed}>
                <input
                    type="url"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    placeholder="URL feed RSS"
                    required
                />
                <button type="submit">Add source</button>
            </form>
        </div>
    );
};

export default Header;
