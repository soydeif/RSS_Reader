import { useDisplayLogic } from "@/hooks/useDisplayLogic";
import { useFeeds } from "@/hooks/useFeeds";
import { useEffect, useState } from "react";

interface NewsItem {
    id: number;
    title: string;
    summary: string;
    image: string | null;
    source: string;
    publishedAt: string;
    link: string;
}


const DashboardDisplay: React.FC = () => {
    const { getDashboardContent, loading } = useFeeds();
    const {
        modifyLinks
    } = useDisplayLogic();


    const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
    const [localNews, setLocalNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        if (!loading) {
            const { featuredNews, localNews } = getDashboardContent();


            setFeaturedNews(featuredNews);
            setLocalNews(localNews);
        }
    }, [loading, getDashboardContent]);

    return (
        <div className="bento-grid">
            {loading ? <p>Cargando</p> :
                <>
                    <div className="bento-column featured-news">
                        <h2>Noticias destacadas</h2>
                        <div className="featured-items">
                            {featuredNews.map((item) => (
                                <div className="featured-item" key={item.id}>
                                    {item.image && (
                                        <img src={item.image} alt={item.title} className="featured-image" />
                                    )}
                                    <div className="featured-content">
                                        <h3>{item.title}</h3>
                                        <span className="featured-source">{item.source}</span> <br />
                                        <div>{modifyLinks(item.summary, true)}</div>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="continue-reading"
                                            >
                                                Continue reading...
                                            </a>
                                        )}


                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bento-column local-news">
                        <h2>Noticias locales</h2>
                        <div className="local-items">
                            {localNews.map((item) => (
                                <div className="local-item" key={item.id}>
                                    <div className="local-content">
                                        <h3>{item.title}</h3>
                                        <span className="local-source">{item.source}</span><br />
                                        <div>{modifyLinks(item.summary, true)}</div>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="continue-reading"
                                            >
                                                Continue reading...
                                            </a>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div></>}
        </div>
    );
};

export default DashboardDisplay;
