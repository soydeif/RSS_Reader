import React from 'react';
import { FeedItemPost } from '../types/RSSFeed';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface SidebarProps {
    selectedFeedData: FeedItemPost[];
    savedPosts: FeedItemPost[];
    onSavePost: (post: FeedItemPost) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ selectedFeedData, savedPosts, onSavePost }) => {
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

    return (
        <div>
            {selectedFeedData.map((post, index) => {
                const isSaved = savedPosts.some(savedPost => savedPost.id === post.id);
                return (
                    <div key={index} style={{
                        marginBottom: '16px',
                        padding: '12px',
                        border: '1px solid #eaeaea',
                        borderRadius: '8px',
                        background: '#f9f9f9',
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '845px'
                    }}
                        className='rss-item'
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="headline">
                            <h4 style={{ margin: 0 }}>{modifyLinks(post.title)}</h4>
                            {isSaved ? (
                                <HeartTwoTone
                                    onClick={() => onSavePost(post)}
                                    twoToneColor="#eb2f96"
                                    style={{ fontSize: '24px', cursor: 'pointer' }}
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={() => onSavePost(post)}
                                    style={{ fontSize: '24px', cursor: 'pointer' }}
                                />
                            )}
                        </div>
                        {post?.thumbnailUrl && <img src={post?.thumbnailUrl} alt={post?.title} loading='lazy' />}
                        <p style={{ marginTop: '8px' }}>{modifyLinks(post.description)}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar; 