import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFeed } from "../rssSlice";
import { fetchRssFeedAsText } from "../rssService";
import { v4 as uuidv4 } from "uuid";
import { Input, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';
interface SearchbarProps {
    collapsed: boolean;
}

const Searchbar: React.FC<SearchbarProps> = ({ collapsed }) => {
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
        <form onSubmit={handleAddFeed} style={{ display: 'flex', alignItems: 'center', padding: !collapsed ? '0 16px' : 0 }}>
            {collapsed ? (

                <Button type="text" htmlType="submit" icon={<SearchOutlined />} style={{ padding: '0 27.5px', margin: '4px', width: '71px', height: '40px' }} />
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', padding: '2rem 0' }}>
                    <Input
                        type="url"
                        value={feedUrl}
                        onChange={(e) => setFeedUrl(e.target.value)}
                        placeholder="URL feed RSS"
                        required
                        style={{ marginRight: '8px' }}
                    />
                    <Button type="default" htmlType="submit">Add source</Button>
                </div>
            )}
        </form>
    );
};

export default Searchbar;
