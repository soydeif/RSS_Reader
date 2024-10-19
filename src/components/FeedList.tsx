import { FeedListProps } from "../types/RSSFeed";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useRef, useState } from "react";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export const FeedList: React.FC<FeedListProps> = ({
    feeds,
    activeFeedIndex,
    onFeedClick,
    onDeleteFeed,
    selectedFeedData,
}) => {
    const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);
    const [visibleDeleteIndex, setVisibleDeleteIndex] = useState<number | null>(null);
    const [confirmDeleteFeedId, setConfirmDeleteFeedId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


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

    const handleDetailsToggle = (index: number) => {
        detailsRefs.current.forEach((details, idx) => {
            if (details && idx !== index && details.open) {
                details.removeAttribute("open");
            }
        });
    };

    const handleToggleDeleteIcon = (index: number) => {
        setVisibleDeleteIndex(visibleDeleteIndex === index ? null : index);
    };

    const handleDeleteClick = (e: React.MouseEvent, feedId: string) => {
        e.stopPropagation();
        setIsModalOpen(true);
        setConfirmDeleteFeedId(feedId);
    };

    const confirmDelete = () => {
        if (confirmDeleteFeedId) {
            onDeleteFeed(confirmDeleteFeedId);
        }
        setConfirmDeleteFeedId(null);
    };

    const cancelDelete = () => {
        setConfirmDeleteFeedId(null);
    };

    const renderVideo = (videoId: string) => {
        if (videoId) {
            return (
                <div className="video-container">
                    <iframe
                        width="400"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Video"
                        allowFullScreen
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            {confirmDeleteFeedId && (
                <>

                    <Modal title="Aviso" open={isModalOpen} onOk={confirmDelete} onCancel={cancelDelete} >
                        <ExclamationCircleOutlined />
                        <p>Estás a punto de eliminar "{feeds.find(feed => feed.id === confirmDeleteFeedId)?.title}" de tu listado de favoritos.
                            ¿Estás seguro de que quieres continuar?
                        </p>
                    </Modal>
                </>
            )}
            <ul>
                {feeds.map((feed, index) => (
                    <li key={feed.id}>
                        <div
                            className={`feed-header ${activeFeedIndex === index ? "active" : ""}`}
                            onClick={() => {
                                onFeedClick(feed.url, index);
                                handleToggleDeleteIcon(index);
                            }}
                        >
                            <h3>{feed.title}</h3>

                            {visibleDeleteIndex === index && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, feed.id)}
                                >
                                    ✖
                                </button>
                            )}
                        </div>


                        {activeFeedIndex === index && selectedFeedData && (
                            <div className="mobile-posts">
                                {selectedFeedData.map((post, idx) => (
                                    <details
                                        key={idx}
                                        ref={(el) => (detailsRefs.current[idx] = el)}
                                        onToggle={() => {
                                            if (detailsRefs.current[idx]?.open) {
                                                handleDetailsToggle(idx);
                                            }
                                        }}
                                    >
                                        <summary>{post.title}</summary>

                                        <div className="post-content">
                                            {post.videoId && renderVideo(post.videoId)}
                                            {modifyLinks(post.description)}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>


        </div>
    );
};
